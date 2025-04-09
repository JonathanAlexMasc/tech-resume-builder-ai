'use server'; // This file is a server action

import { signIn, signOut } from "@/auth";

export async function loginAction(formData) {
    const action = formData.get("action");
    console.log("action", action);
    await signIn(action, {redirectTo: "/home"});
}

export async function logoutAction() {
    await signOut({redirectTo: "/"});
}