import { auth } from "@/auth";
import Image from "next/image";
import React from "react";

export default async function ProfilePage() {
    const session = await auth();
    const user = session?.user;

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <p className="text-gray-600 dark:text-gray-300 text-xl">Loading your profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white px-4 sm:px-6 lg:px-16 py-16">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center">Your Profile</h1>

                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 shadow-md">
                    <div className="flex flex-col items-center">
                        {/* Optional User Avatar */}
                        {user.image && (
                            <Image
                                src={user.image}
                                alt="User Avatar"
                                width={96}
                                height={96}
                                className="rounded-full mb-4"
                            />
                        )}

                        <h2 className="text-2xl font-semibold mb-2">
                            {user.name || "No Name Provided"}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {user.email || "No Email Provided"}
                        </p>

                    </div>
                </div>

            </div>
        </div>
    );
}
