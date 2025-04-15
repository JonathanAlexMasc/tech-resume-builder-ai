
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

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get('resumeId');

    if (!resumeId) {
        return new Response('Missing resumeId', { status: 400 });
    }

    try {
        const projects = await prisma.project.findMany({
            where: { resumeId: parseInt(resumeId, 10) },
            include: { bulletPoints: true },
        });

        return Response.json({ projects });
    } catch (err) {
        console.error('[GET /api/resume/project]', err);
        return new Response('Failed to fetch projects', { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response('Missing project ID', { status: 400 });
    }

    try {
        await prisma.bulletPoint.deleteMany({
            where: { projectId: parseInt(id, 10) },
        });

        await prisma.project.delete({
            where: { id: parseInt(id, 10) },
        });

        return new Response('Project deleted', { status: 200 });
    } catch (err) {
        console.error('[DELETE /api/resume/project]', err);
        return new Response('Failed to delete project', { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const { id, resumeId, title } = await req.json();

        if (!id || !resumeId || !title) {
            return new Response('Missing fields for update', { status: 400 });
        }

        const updated = await prisma.project.update({
            where: { id },
            data: {
                resumeId,
                title,
            },
        });

        return Response.json({ project: updated });
    } catch (err) {
        console.error('[PUT /api/resume/project]', err);
        return new Response('Failed to update project', { status: 500 });
    }
}
