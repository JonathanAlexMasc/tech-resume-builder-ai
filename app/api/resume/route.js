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
            },
        })

        return NextResponse.json({ success: true, resume })
    } catch (err) {
        console.error('[POST /api/resume] Error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}