'use server'; // This file is a server action

import { signIn, signOut } from "@/auth";
import { PrismaClient } from '@prisma/client';
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function loginAction(formData) {
    const action = formData.get("action");
    console.log("action", action);
    await signIn(action, {redirectTo: "/home"});
}

export async function logoutAction() {
    await signOut({redirectTo: "/"});
}

export async function getUserResumes() {
    const session = await auth();
    if (!session?.user) {
        return <AuthRedirectMessage />;
    }

    const resumes = await prisma.resume.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    console.log(resumes)

    return resumes;
}

