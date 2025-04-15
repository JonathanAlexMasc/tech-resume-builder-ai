
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
        const { resumeId, school, location, startDate, endDate, major } = body;

        if (!resumeId || !school || !startDate || !location || !major) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const education = await prisma.education.create({
            data: {
                resumeId,
                school,
                location,
                major,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
            },
        });

        return NextResponse.json({ education }, { status: 201 });
    } catch (error) {
        console.error('Failed to save education:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const resumeId = parseInt(searchParams.get('resumeId'));

        if (!resumeId) {
            return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 });
        }

        const education = await prisma.education.findMany({
            where: { resumeId },
            orderBy: { startDate: 'desc' },
        });

        return NextResponse.json({ education }, { status: 200 });
    } catch (error) {
        console.error('Failed to fetch education:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, resumeId, school, location, startDate, endDate, major } = body;

        if (!id || !resumeId || !school || !location || !startDate || !major) {
            return new Response('Missing required fields', { status: 400 });
        }

        const updated = await prisma.education.update({
            where: { id },
            data: {
                resumeId,
                school,
                location,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                major,
            },
        });

        return Response.json({ education: updated });
    } catch (error) {
        console.error('[PUT /api/resume/education]', error);
        return new Response('Failed to update education', { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const session = await auth();
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id'));

        if (!id || isNaN(id)) {
            return NextResponse.json({ error: 'Missing or invalid education ID' }, { status: 400 });
        }

        await prisma.education.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Education deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('[DELETE /api/resume/education]', error);
        return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
    }
}
