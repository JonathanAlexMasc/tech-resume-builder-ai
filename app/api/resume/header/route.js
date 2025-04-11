import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { auth } from '@/auth'

const prisma = new PrismaClient()

export async function GET(req) {
    try {
        const session = await auth();

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const resumeIdParam = req.nextUrl.searchParams.get('resumeId');

        if (!resumeIdParam) {
            return NextResponse.json({ error: 'Missing resumeId' }, { status: 400 });
        }

        const resumeId = parseInt(resumeIdParam, 10);

        const header = await prisma.header.findUnique({
            where: { resumeId },
        });

        if (!header) {
            return NextResponse.json({ error: 'Header not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, header });
    } catch (err) {
        console.error('[GET /api/resume/header] Error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await auth()

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const { resumeId, firstName, lastName, phone, linkedin, github } = body

        const header = await prisma.header.upsert({
            where: { resumeId },
            update: {
                firstName,
                lastName,
                phone,
                linkedin,
                github,
            },
            create: {
                resumeId,
                firstName,
                lastName,
                phone,
                linkedin,
                github,
            }
        })

        return NextResponse.json({ success: true, header })
    } catch (err) {
        console.error('[POST /api/resume/header] Error:', err)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
