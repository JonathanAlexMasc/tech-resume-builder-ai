import { readFileSync } from 'fs';
import path from 'path';

export async function GET(req) {
    const url = new URL(req.url);
    const resumeId = url.searchParams.get('resumeId');

    if (!resumeId) {
        return new Response(JSON.stringify({ error: 'Missing resumeId' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const logsDir = process.env.NODE_ENV === 'development'
        ? path.join('logs')
        : path.join('/tmp', 'logs');

    const filePath = path.join(logsDir, `resume-${resumeId}.pdf`);

    try {
        const fileBuffer = readFileSync(filePath);
        return new Response(fileBuffer, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="resume-${resumeId}.pdf"`,
            },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'PDF not found. Compile it first.' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
