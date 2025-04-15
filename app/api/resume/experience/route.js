
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

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id'), 10);

    if (!id) {
        return new Response('Missing experience ID', { status: 400 });
    }

    try {
        // Delete associated bullet points first
        await prisma.bulletPoint.deleteMany({
            where: { experienceId: id },
        });

        // Then delete the experience
        await prisma.experience.delete({
            where: { id },
        });

        return new Response('Experience deleted', { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response('Failed to delete experience', { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, resumeId, role, company, location, startDate, endDate } = body;

        if (!id) {
            return new Response('Missing experience ID', { status: 400 });
        }

        const updated = await prisma.experience.update({
            where: { id },
            data: {
                resumeId,
                role,
                company,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
            },
        });

        return Response.json({ experience: updated });
    } catch (err) {
        console.error('[PUT /api/resume/experience]', err);
        return new Response('Failed to update experience', { status: 500 });
    }
}