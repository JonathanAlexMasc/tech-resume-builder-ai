const { PrismaClient } = require('@prisma/client');
const { writeFileSync, readFileSync, existsSync, mkdirSync, appendFileSync } = require('fs');
const path = require('path');
const tmp = require('tmp');
const prisma = new PrismaClient();

import { escapeLatex, renderExperience, renderProjects, renderEducation, renderSkills } from '@/helpers';

function logLatexToFile(resumeId, tex) {
    console.log("ENV: ", process.env.NODE_ENV)

    const logsDir = process.env.NODE_ENV === 'development'
        ? path.join('logs')           // local relative path
        : path.join('/tmp', 'logs');   // absolute tmp path for production
    
    console.log("LOGS DIR: ", logsDir)
    if (!existsSync(logsDir)) {
        mkdirSync(logsDir);
    }
    const filePath = path.join(logsDir, `resume-${resumeId}.tex`);
    writeFileSync(filePath, tex);
}

function logErrorToFile(error) {
    const logsDir = process.env.NODE_ENV === 'development'
        ? path.join('logs')           // local relative path
        : path.join('/tmp', 'logs');   // absolute tmp path for production
    if (!existsSync(logsDir)) {
        mkdirSync(logsDir);
    }
    const filePath = path.join(logsDir, 'error.log');
    appendFileSync(filePath, `[${new Date().toISOString()}] ${error}\n`);
}

export async function POST(req) {
    const body = await req.json();
    const { resumeId } = body;

    const resume = await prisma.resume.findUnique({
        where: { id: resumeId },
        include: {
            header: true,
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
        .replace(/%%%NAME%%%/, escapeLatex(`${resume.header?.firstName ?? ''} ${resume.header?.lastName ?? ''}`))
        .replace(/%%%PHONE%%%/, escapeLatex(resume.header?.phone ?? ''))
        .replace(
            /%%%LINKEDIN%%%/,
            resume.header?.linkedin ? `\\href{${resume.header.linkedin}}{${escapeLatex(resume.header.linkedin)}}` : ''
        )
        .replace(
            /%%%GITHUB%%%/,
            resume.header?.github ? `\\href{${resume.header.github}}{${escapeLatex(resume.header.github)}}` : ''
        )
        .replace(/%%%EXPERIENCE%%%/, renderExperience(resume.Experience))
        .replace(/%%%PROJECTS%%%/, renderProjects(resume.projects))
        .replace(/%%%EDUCATION%%%/, renderEducation(resume.education))
        .replace(/%%%SKILLS%%%/, renderSkills(resume.skills));

    logLatexToFile(resumeId, texFilled);

    const tempDir = tmp.dirSync({ unsafeCleanup: true });
    const texFilePath = path.join(tempDir.name, 'resume.tex');
    writeFileSync(texFilePath, texFilled);

    // return fetch('http://localhost:3001/compile'
    /*
    return fetch('https://latex-pdf-conversion-service-production.up.railway.app/compile',
    */

    return fetch('https://latex-pdf-conversion-service-production.up.railway.app/compile', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_LATEX_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
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