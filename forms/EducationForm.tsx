'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';


export default function EducationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [form, setForm] = useState({
        school: '',
        startDate: '',
        endDate: '',
        location: '',
        major: '',
    });

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/education', {
            method: 'POST',
            body: JSON.stringify({
                resumeId,
                school: form.school,
                startDate: `${form.startDate}-01`,
                endDate: form.endDate ? `${form.endDate}-01` : null,
                location: form.location,
                major: form.major,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            router.push(`/download?resumeId=${resumeId}`);
        } else {
            alert('Failed to save education');
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-8 bg-white dark:bg-black">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white dark:bg-black p-6 rounded-md shadow-md text-gray-900 dark:text-gray-100">
                <div className="space-y-12">
                    <div className="border-b border-gray-300 dark:border-gray-700 pb-12">
                        <h2 className="text-base font-semibold">Education</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Tell us about your most recent or relevant education.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="school" className="block text-sm font-medium">School/University</label>
                                <input
                                    id="school"
                                    name="school"
                                    type="text"
                                    value={form.school}
                                    onChange={handleFormChange}
                                    placeholder="Stanford University"
                                    required
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="location" className="block text-sm font-medium">Location</label>
                                <input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={form.location}
                                    onChange={handleFormChange}
                                    placeholder="Palo Alto, CA"
                                    required
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
                                <input
                                    id="startDate"
                                    name="startDate"
                                    type="month"
                                    value={form.startDate}
                                    onChange={handleFormChange}
                                    required
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
                                <input
                                    id="endDate"
                                    name="endDate"
                                    type="month"
                                    value={form.endDate}
                                    onChange={handleFormChange}
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                />
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="major" className="block text-sm font-medium">Major</label>
                                <input
                                    id="major"
                                    name="major"
                                    type="text"
                                    value={form.major}
                                    onChange={handleFormChange}
                                    placeholder="Computer Science"
                                    required
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold text-gray-900 dark:text-white">Back</button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}