
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
