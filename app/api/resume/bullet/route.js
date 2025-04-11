import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        const experienceIdParam = req.nextUrl.searchParams.get('experienceId');
        const projectIdParam = req.nextUrl.searchParams.get('projectId');

        if (!experienceIdParam && !projectIdParam) {
            return NextResponse.json(
                { error: 'Missing experienceId or projectId in query parameters' },
                { status: 400 }
            );
        }

        const whereClause = experienceIdParam
            ? { experienceId: parseInt(experienceIdParam, 10) }
            : { projectId: parseInt(projectIdParam, 10) };

        const bullets = await prisma.bulletPoint.findMany({
            where: whereClause,
            orderBy: { id: 'asc' },
        });

        return NextResponse.json({ success: true, bullets });
    } catch (err) {
        console.error('[GET /api/resume/bullet] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

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

        let bullet;

        if (experienceId) {
            bullet = await prisma.bulletPoint.upsert({
                where: {
                    content_experienceId: {
                        content,
                        experienceId,
                    },
                },
                update: {}, // no updates for now
                create: {
                    content,
                    experienceId,
                },
            });
        } else {
            bullet = await prisma.bulletPoint.upsert({
                where: {
                    content_projectId: {
                        content,
                        projectId,
                    },
                },
                update: {},
                create: {
                    content,
                    projectId,
                },
            });
        }

        return NextResponse.json({ success: true, bullet });
    } catch (err) {
        console.error('[POST /api/resume/bullet] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

