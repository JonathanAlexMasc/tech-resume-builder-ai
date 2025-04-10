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
        const { content, experienceId, projectId } = body;

        // Validate input
        if (!content || (!experienceId && !projectId)) {
            return NextResponse.json(
                { error: 'Bullet point must have content and either an experienceId or projectId' },
                { status: 400 }
            );
        }

        const bullet = await prisma.bulletPoint.create({
            data: {
                content,
                experienceId: experienceId ?? null,
                projectId: projectId ?? null,
            },
        });

        return NextResponse.json({ success: true, bullet });
    } catch (err) {
        console.error('[POST /api/bullet] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
