
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
        const { name, resumeId, isLanguage, isFramework, isDev, isCloud } = body;

        if (!name || !resumeId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const skill = await prisma.skill.create({
            data: {
                name,
                resumeId,
                isLanguage: !!isLanguage,
                isFramework: !!isFramework,
                isDev: !!isDev,
                isCloud: !!isCloud,
            },
        });

        return NextResponse.json({ success: true, skill });
    } catch (err) {
        console.error('[POST /api/skill] Error:', err);
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
        const skills = await prisma.skill.findMany({
            where: { resumeId: parseInt(resumeId, 10) },
        });

        return Response.json({ skills });
    } catch (err) {
        console.error('[GET /api/resume/skill]', err);
        return new Response('Failed to fetch skills', { status: 500 });
    }
}

export async function DELETE(req) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return new Response('Missing skill ID', { status: 400 });
    }

    try {
        await prisma.skill.delete({
            where: { id: parseInt(id, 10) },
        });

        return new Response('Skill deleted', { status: 200 });
    } catch (err) {
        console.error('[DELETE /api/resume/skill]', err);
        return new Response('Failed to delete skill', { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const body = await req.json();
        const { id, name, isLanguage, isFramework, isDev, isCloud } = body;

        if (!id || !name) {
            return new Response('Missing skill ID or name', { status: 400 });
        }

        const updated = await prisma.skill.update({
            where: { id },
            data: {
                name,
                isLanguage,
                isFramework,
                isDev,
                isCloud,
            },
        });

        return Response.json({ skill: updated });
    } catch (err) {
        console.error('[PUT /api/resume/skill]', err);
        return new Response('Failed to update skill', { status: 500 });
    }
}