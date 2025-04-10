'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HeaderForm() {
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const payload = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            phone: formData.get('phone'),
            linkedin: formData.get('linkedin'),
            github: formData.get('github')
        };

        const res = await fetch('/api/header', {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            const data = await res.json();
            const resumeId = data.resume.id; // ✅ Access the resume ID returned from backend
            console.log('Resume ID:', resumeId);

            // Pass resumeId to experience page via URL:
            router.push(`/experience?resumeId=${resumeId}`);
        } else {
            console.error('Error saving data');
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-8 bg-white dark:bg-black">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-black p-6 rounded-md shadow-md text-gray-900 dark:text-gray-100 w-full max-w-2xl">
                <div className="space-y-12">
                    <div className="border-b border-gray-300 dark:border-gray-700 pb-12">
                        <h2 className="text-base font-semibold">Header Section</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            This info appears at the top of your resume: your name, contact, and project links.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/* First Name */}
                            <div className="sm:col-span-3">
                                <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    id="firstName"
                                    placeholder="John"
                                    required
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="sm:col-span-3">
                                <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    id="lastName"
                                    placeholder="Smith"
                                    required
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>

                            {/* Phone (optional) */}
                            <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium">Phone <span className="text-gray-400 text-xs">(optional)</span></label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    placeholder="(123) 456-7890"
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>

                            {/* LinkedIn */}
                            <div className="sm:col-span-3">
                                <label htmlFor="linkedin" className="block text-sm font-medium">LinkedIn <span className="text-gray-400 text-xs">(optional)</span></label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    id="linkedin"
                                    placeholder="https://linkedin.com/in/yourname"
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>

                            {/* GitHub */}
                            <div className="sm:col-span-3">
                                <label htmlFor="github" className="block text-sm font-medium">GitHub <span className="text-gray-400 text-xs">(optional)</span></label>
                                <input
                                    type="url"
                                    name="github"
                                    id="github"
                                    placeholder="https://github.com/yourname"
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}
