
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET(req) {
    const resumeIdParam = req.nextUrl.searchParams.get('resumeId');

    if (!resumeIdParam) {
        return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 });
    }

    const resumeId = parseInt(resumeIdParam, 10);

    const experiences = await prisma.experience.findMany({
        where: { resumeId },
        include: {
            bulletPoints: true,
        },
        orderBy: { startDate: 'desc' },
    });

    return NextResponse.json({ experiences });
}

export async function POST(req) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { resumeId, role, company, startDate, endDate, location } = body;

        const experience = await prisma.experience.upsert({
            where: {
                resumeId_role_company_startDate: {
                    resumeId,
                    role,
                    company,
                    startDate: new Date(startDate),
                },
            },
            update: {
                location,
                endDate: endDate ? new Date(endDate) : null,
            },
            create: {
                resumeId,
                role,
                company,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
            },
        });

        return NextResponse.json({ success: true, experience });
    } catch (err) {
        console.error('[POST /api/resume/experience] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
