const { PrismaClient } = require('@prisma/client');
const { writeFileSync, readFileSync} = require('fs');
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

    return fetch('https://latex-pdf-conversion-service-production.up.railway.app/compile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tex: texFilled })
    })
        .then(async (res) => {
            if (!res.ok) {
                const errorText = await res.text();
                logErrorToFile(`Railway API Error: ${errorText}`);
                return new Response(JSON.stringify({ error: 'PDF generation failed' }), {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' }
                });
            }

            const pdfBuffer = Buffer.from(await res.arrayBuffer());

            return new Response(pdfBuffer, {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename=resume.pdf'
                }
            });
        })
        .catch((err) => {
            logErrorToFile(`Railway API Request Failed: ${err.message}`);
            return new Response(JSON.stringify({ error: 'PDF generation service failed' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        });
}