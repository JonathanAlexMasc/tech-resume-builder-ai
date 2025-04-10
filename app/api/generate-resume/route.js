const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const { writeFileSync, readFileSync, existsSync, appendFileSync, mkdirSync } = require('fs');
const path = require('path');
const tmp = require('tmp');

const prisma = new PrismaClient();

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

// Helpers

function escapeLatex(str) {
    return str.replace(/([&%#_{}$])/g, '\\$1').replace(/~/g, '\\textasciitilde{}');
}

function formatDate(date) {
    if (!date) return 'Present';
    const d = new Date(date);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
}

function renderExperience(experiences) {
    return experiences.map(exp => `
\\resumeSubheading
  {${escapeLatex(exp.role)}}{${formatDate(exp.startDate)} -- ${formatDate(exp.endDate)}}
  {${escapeLatex(exp.company)}}{}
  \\resumeItemListStart
    ${exp.bulletPoints.map(bp => `\\resumeItem{${escapeLatex(bp.content)}}`).join('\n')}
  \\resumeItemListEnd
`).join('\n');
}

function renderProjects(projects) {
    return projects.map(proj => `
\\resumeProjectHeading
  {\\textbf{${escapeLatex(proj.title)}}}{}
  \\resumeItemListStart
    ${proj.bulletPoints.map(bp => `\\resumeItem{${escapeLatex(bp.content)}}`).join('\n')}
  \\resumeItemListEnd
`).join('\n');
}

function renderEducation(educations) {
    return educations.map(edu => `
\\resumeSubheading
  {${escapeLatex(edu.school)}}{${formatDate(edu.startDate)} -- ${formatDate(edu.endDate)}}
  {${escapeLatex(edu.location)}}{${escapeLatex(edu.major)}}
`).join('\n');
}

function renderSkills(skills) {
    const filter = (key) => skills.filter(skill => skill[key]).map(skill => escapeLatex(skill.name)).join(', ');
    return `
\\begin{itemize}[leftmargin=0.15in, label={}]
\\small{\\item{
  \\textbf{Languages}{: ${filter('isLanguage')}} \\\\
  \\textbf{Frameworks}{: ${filter('isFramework')}} \\\\
  \\textbf{Developer Tools}{: ${filter('isDev')}} \\\\
  \\textbf{Cloud \\& Concepts}{: ${filter('isCloud')}}
}}
\\end{itemize}
`;
}

function logErrorToFile(errorMessage) {
    const logDir = path.resolve('logs');
    const logPath = path.join(logDir, 'latex-errors.log');

    if (!existsSync(logDir)) {
        mkdirSync(logDir);
    }

    const timestamp = new Date().toISOString();
    const logEntry = `\n[${timestamp}]\n${errorMessage}\n`;

    appendFileSync(logPath, logEntry, 'utf8');
}
