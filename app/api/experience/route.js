
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
        const { resumeId, role, company, startDate, endDate, location } = body;

        const experience = await prisma.experience.create({
            data: {
                role,
                company,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                resumeId,
                location
            },
        });

        return NextResponse.json({ success: true, experience });
    } catch (err) {
        console.error('[POST /api/experience] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
