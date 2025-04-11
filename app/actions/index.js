'use server'; // This file is a server action

import { signIn, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function loginAction(formData) {
    const action = formData.get("action");
    console.log("action", action);
    await signIn(action, {redirectTo: "/home"});
}

export async function logoutAction() {
    await signOut({redirectTo: "/"});
}

export async function getUserResumes() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return [];

    const resumes = await prisma.resume.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
        select: {
            id: true,
            title: true,
            updatedAt: true,
        },
    });

    return resumes.map((r) => ({
        id: r.id,
        title: r.title,
        lastEdited: r.updatedAt.toDateString(),
    }));
}

