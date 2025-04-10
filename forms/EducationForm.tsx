'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EducationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [educations, setEducations] = useState([
        {
            school: '',
            location: '',
            startDate: '',
            endDate: '',
            major: '',
        },
    ]);

    const handleChange = (index, e) => {
        const updated = [...educations];
        updated[index][e.target.name] = e.target.value;
        setEducations(updated);
    };

    const addEducation = () => {
        setEducations([
            ...educations,
            {
                school: '',
                location: '',
                startDate: '',
                endDate: '',
                major: '',
            },
        ]);
    };

    const removeEducation = (index) => {
        setEducations(educations.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const edu of educations) {
            const res = await fetch('/api/education', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId,
                    school: edu.school,
                    startDate: `${edu.startDate}-01`,
                    endDate: edu.endDate ? `${edu.endDate}-01` : null,
                    location: edu.location,
                    major: edu.major,
                }),
            });

            if (!res.ok) {
                alert('Failed to save one or more education entries');
                return;
            }
        }

        router.push(`/download?resumeId=${resumeId}`);
    };

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-8 bg-white dark:bg-black">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white dark:bg-black p-6 rounded-md shadow-md text-gray-900 dark:text-gray-100"
            >
                <div className="space-y-12">
                    <h2 className="text-xl font-bold">Education</h2>
                    {educations.map((edu, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-300 dark:border-gray-700 pb-12"
                        >
                            <h3 className="text-base font-semibold mb-2">
                                Education {index + 1}
                            </h3>

                            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-4">
                                    <label htmlFor="school" className="block text-sm font-medium">
                                        School/University
                                    </label>
                                    <input
                                        type="text"
                                        name="school"
                                        value={edu.school}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="Stanford University"
                                        required
                                        className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="location" className="block text-sm font-medium">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={edu.location}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="Palo Alto, CA"
                                        required
                                        className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="startDate" className="block text-sm font-medium">
                                        Start Date
                                    </label>
                                    <input
                                        type="month"
                                        name="startDate"
                                        value={edu.startDate}
                                        onChange={(e) => handleChange(index, e)}
                                        required
                                        className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="endDate" className="block text-sm font-medium">
                                        End Date
                                    </label>
                                    <input
                                        type="month"
                                        name="endDate"
                                        value={edu.endDate}
                                        onChange={(e) => handleChange(index, e)}
                                        className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                    />
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="major" className="block text-sm font-medium">
                                        Major
                                    </label>
                                    <input
                                        type="text"
                                        name="major"
                                        value={edu.major}
                                        onChange={(e) => handleChange(index, e)}
                                        placeholder="Computer Science"
                                        required
                                        className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                    />
                                </div>
                            </div>

                            {educations.length > 1 && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={() => removeEducation(index)}
                                        className="text-red-500"
                                    >
                                        Remove this education
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-start">
                        <button
                            type="button"
                            onClick={addEducation}
                            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                        >
                            + Add another education
                        </button>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button onClick={() => router.back()} type="button" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Back
                    </button>
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
