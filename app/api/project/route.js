
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { resumeId, title } = body;

        if (!resumeId || !title) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const resume = await prisma.resume.findUnique({
            where: { id: resumeId },
        });

        if (!resume) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        const project = await prisma.project.create({
            data: {
                title,
                resumeId,
            },
        });

        return NextResponse.json({ success: true, project });
    } catch (err) {
        console.error('[POST /api/project] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
