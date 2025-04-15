import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const resumes = await prisma.resume.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ resumes });
    } catch (err) {
        console.error('[GET /api/resume] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST() {
    try {
        const session = await auth()

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const resume = await prisma.resume.create({
            data: {
                userId: user.id,
                name: "untitled"
            },
        })

        return NextResponse.json({ success: true, resume })
    } catch (err) {
        console.error('[POST /api/resume] Error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(req) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, name } = body;

    if (!id || typeof name !== 'string') {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const resume = await prisma.resume.update({
        where: { id },
        data: { name },
    });

    return NextResponse.json({ resume });
}

export async function DELETE(req) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = parseInt(searchParams.get('id'));

    if (!id || isNaN(id)) {
        return NextResponse.json({ error: 'Invalid resume ID' }, { status: 400 });
    }

    await prisma.resume.delete({ where: { id } });

    return NextResponse.json({ message: 'Resume deleted' });
}
