const path = require('path');
const { writeFileSync, existsSync, mkdirSync, appendFileSync } = require('fs');

function escapeLatex(str) {
    return str.replace(/([&%#_{}$])/g, '\\$1').replace(/~/g, '\\textasciitilde{}');
}

function formatDate(date) {
    if (!date) return 'Present';
    const d = new Date(date);
    return `${d.toLocaleString('default', { month: 'short' })} ${d.getFullYear()}`;
}

function renderExperience(experiences) {
  console.log("experiences", experiences);

  return [
    '\\resumeSubHeadingListStart',
    ...experiences.map(exp => `
  \\resumeSubheading
    {${escapeLatex(exp.role)}}{${formatDate(exp.startDate)} -- ${formatDate(exp.endDate)}}
    {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
    \\resumeItemListStart
      ${exp.bulletPoints.map(bp => `\\resumeItem{${escapeLatex(bp.content)}}`).join('\n      ')}
    \\resumeItemListEnd
  `),
    '\\resumeSubHeadingListEnd'
  ].join('\n');
}


function renderProjects(projects) {
  return [
    '\\resumeSubHeadingListStart',
    ...projects.map(proj => `
  \\resumeProjectHeading
    {\\textbf{${escapeLatex(proj.title)}}}{}
    \\resumeItemListStart
      ${proj.bulletPoints.map(bp => `\\resumeItem{${escapeLatex(bp.content)}}`).join('\n      ')}
    \\resumeItemListEnd
  `),
    '\\resumeSubHeadingListEnd'
  ].join('\n');
}


function renderEducation(educations) {
  return [
    '\\resumeSubHeadingListStart',
    ...educations.map(edu => `
  \\resumeSubheading
    {${escapeLatex(edu.school)}}{${formatDate(edu.startDate)} -- ${formatDate(edu.endDate)}}
    {${escapeLatex(edu.location)}}{${escapeLatex(edu.major)}}
  `),
    '\\resumeSubHeadingListEnd'
  ].join('\n');
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

function logLatexToFile(resumeId, texContent) {
    const logDir = path.resolve('logs');
    const logPath = path.join(logDir, `resume-${resumeId}.tex`);

    if (!existsSync(logDir)) {
        mkdirSync(logDir);
    }

    writeFileSync(logPath, texContent, 'utf8');
}

// Export all helper functions
module.exports = {
    escapeLatex,
    formatDate,
    renderExperience,
    renderProjects,
    renderEducation,
    renderSkills,
    logErrorToFile,
    logLatexToFile
};
