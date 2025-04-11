'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowPathIcon } from '@heroicons/react/24/solid';

export default function HeaderForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        linkedin: '',
        github: '',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchHeader() {
            if (!resumeId) return;

            const res = await fetch(`/api/resume/header?resumeId=${resumeId}`, {
                method: 'GET',
            });

            if (res.ok) {
                const data = await res.json();
                if (data.header) {
                    setFormData({
                        firstName: data.header.firstName || '',
                        lastName: data.header.lastName || '',
                        phone: data.header.phone || '',
                        linkedin: data.header.linkedin || '',
                        github: data.header.github || '',
                    });
                }
            }

            setLoading(false);
        }

        fetchHeader();
    }, [resumeId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            resumeId,
            ...formData,
        };

        const res = await fetch(`/api/resume/header`, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            router.push(`/resume/experience?resumeId=${resumeId}`);
        } else {
            console.error('Error saving data');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black">
                <ArrowPathIcon className="h-8 w-8 animate-spin text-gray-600 dark:text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    Loading header data...
                </p>
            </div>
        );
    }

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
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
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
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>

                            {/* Phone */}
                            <div className="sm:col-span-3">
                                <label htmlFor="phone" className="block text-sm font-medium">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    id="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>

                            {/* LinkedIn */}
                            <div className="sm:col-span-3">
                                <label htmlFor="linkedin" className="block text-sm font-medium">LinkedIn</label>
                                <input
                                    type="url"
                                    name="linkedin"
                                    id="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>

                            {/* GitHub */}
                            <div className="sm:col-span-3">
                                <label htmlFor="github" className="block text-sm font-medium">GitHub</label>
                                <input
                                    type="url"
                                    name="github"
                                    id="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button onClick={() => router.back()} type="button" className="text-sm font-semibold text-gray-900 dark:text-white">
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
