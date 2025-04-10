const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const { writeFileSync, readFileSync, existsSync, appendFileSync, mkdirSync } = require('fs');
const path = require('path');
const tmp = require('tmp');
const prisma = new PrismaClient();

import { escapeLatex, renderExperience, renderProjects, renderEducation, renderSkills, logErrorToFile, logLatexToFile } from '@/helpers';

// Main POST endpoint
export async function POST(req) {
    const body = await req.json();
    const { resumeId } = body;

    const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
        include: {
            Experience: { include: { bulletPoints: true } },
            projects: { include: { bulletPoints: true } },
            education: true,
            skills: true
        }
    });

    if (!resume) {
        return new Response(JSON.stringify({ error: 'Resume not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const templatePath = path.resolve('latex-template', 'resume.tex');
    const texContent = readFileSync(templatePath, 'utf8');

    const texFilled = texContent
        .replace(/%%%NAME%%%/, escapeLatex(`${resume.firstName} ${resume.lastName}`))
        .replace(/%%%PHONE%%%/, escapeLatex(resume.phone || ''))
        .replace(/%%%LINKEDIN%%%/, resume.linkedin ? `\\href{${resume.linkedin}}{${escapeLatex(resume.linkedin)}}` : '')
        .replace(/%%%GITHUB%%%/, resume.github ? `\\href{${resume.github}}{${escapeLatex(resume.github)}}` : '')
        .replace(/%%%EXPERIENCE%%%/, renderExperience(resume.Experience))
        .replace(/%%%PROJECTS%%%/, renderProjects(resume.projects))
        .replace(/%%%EDUCATION%%%/, renderEducation(resume.education))
        .replace(/%%%SKILLS%%%/, renderSkills(resume.skills));
    
    logLatexToFile(resumeId, texFilled);

    const tempDir = tmp.dirSync({ unsafeCleanup: true });
    const texFilePath = path.join(tempDir.name, 'resume.tex');
    writeFileSync(texFilePath, texFilled);

    return new Promise((resolve) => {
        const dockerCmd = `docker run --rm --platform=linux/amd64 -v ${tempDir.name}:/data blang/latex pdflatex -interaction=nonstopmode resume.tex`;

        exec(dockerCmd, (err, stdout, stderr) => {
            if (err) {
                const logMessage = `Resume ID: ${resumeId}\nSTDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`;
                logErrorToFile(logMessage);

                resolve(new Response(JSON.stringify({ error: 'Docker LaTeX compilation failed' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }));
                return;
            }

            const pdfPath = path.join(tempDir.name, 'resume.pdf');
            if (!existsSync(pdfPath)) {
                logErrorToFile(`PDF not generated for Resume ID: ${resumeId}`);
                resolve(new Response(JSON.stringify({ error: 'PDF not generated' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                }));
                return;
            }

            const pdfBuffer = readFileSync(pdfPath);
            tempDir.removeCallback();

            resolve(new Response(pdfBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=resume.pdf'
                }
            }));
        });
    });
}