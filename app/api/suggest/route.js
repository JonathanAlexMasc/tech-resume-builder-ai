import { CohereClient } from 'cohere-ai';
import { NextResponse } from 'next/server';

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY,
});

export async function POST(req) {
    const { role, company, rawBulletPoint } = await req.json();

    const message = `
You are a resume writing assistant. The user worked at ${company} as a ${role}.
Here's their draft bullet point:

"${rawBulletPoint}"

Please suggest 2 improved resume bullet points:
- Use strong action verbs
- Be concise and measurable
- Do not repeat output
- Do not make up numbers
Return only the improved bullet points, one per line. Don't include any dashes in the beginning.
`;

    try {
        const response = await cohere.chat({
            model: 'command-r-plus',
            message,
        });

        const rawText = response.text || '';
        const suggestions = rawText
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);

        return NextResponse.json({ suggestions });
    } catch (error) {
        console.error('Cohere error:', error);
        return NextResponse.json({ error: 'Failed to fetch bullet suggestions' }, { status: 500 });
    }
}