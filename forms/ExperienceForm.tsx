'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ExperienceForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [experiences, setExperiences] = useState([
        {
            role: '',
            company: '',
            location: '',
            startDate: '',
            endDate: '',
            bulletPoints: [''],
        },
    ]);

    const handleExperienceChange = (index, e) => {
        const updated = [...experiences];
        updated[index][e.target.name] = e.target.value;
        setExperiences(updated);
    };

    const handleBulletChange = (expIndex, bulletIndex, value) => {
        const updated = [...experiences];
        updated[expIndex].bulletPoints[bulletIndex] = value;
        setExperiences(updated);
    };

    const addBullet = (expIndex) => {
        const updated = [...experiences];
        updated[expIndex].bulletPoints.push('');
        setExperiences(updated);
    };

    const removeBullet = (expIndex, bulletIndex) => {
        const updated = [...experiences];
        updated[expIndex].bulletPoints.splice(bulletIndex, 1);
        setExperiences(updated);
    };

    const addExperience = () => {
        setExperiences([
            ...experiences,
            {
                role: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                bulletPoints: [''],
            },
        ]);
    };

    const removeExperience = (index) => {
        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        for (const exp of experiences) {
            const expRes = await fetch(`/api/resume/${resumeId}/experience`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resumeId,
                    role: exp.role,
                    company: exp.company,
                    location: exp.location,
                    startDate: `${exp.startDate}-01`,
                    endDate: exp.endDate ? `${exp.endDate}-01` : null,
                }),
            });

            if (!expRes.ok) return alert('Failed to save experience');

            const { experience } = await expRes.json();

            const bulletRes = await Promise.all(
                exp.bulletPoints
                    .filter((b) => b.trim() !== '')
                    .map((content) =>
                        fetch('/api/resume/bullet', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ experienceId: experience.id, content }),
                        })
                    )
            );

            if (!bulletRes.every((res) => res.ok)) {
                return alert('Some bullet points failed to save');
            }
        }

        router.push(`/projects?resumeId=${resumeId}`);
    };

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-8 bg-white dark:bg-black">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white dark:bg-black p-6 rounded-md shadow-md text-gray-900 dark:text-gray-100"
            >
                <div className="space-y-12">
                    <h2 className="text-xl font-bold">Experience</h2>
                    {experiences.map((exp, index) => (
                        <div
                            key={index}
                            className="border-b border-gray-300 dark:border-gray-700 pb-12"
                        >
                            <h3 className="text-base font-semibold mb-2">Experience {index + 1}</h3>

                            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="role" className="block text-sm font-medium">
                                        Job Title
                                    </label>
                                    <input
                                        type="text"
                                        name="role"
                                        value={exp.role}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        placeholder="Software Engineer"
                                        required
                                        className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="company" className="block text-sm font-medium">
                                        Company
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={exp.company}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        placeholder="Amazon"
                                        required
                                        className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                    />
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="location" className="block text-sm font-medium">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={exp.location}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        placeholder="Seattle, WA"
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
                                        value={exp.startDate}
                                        onChange={(e) => handleExperienceChange(index, e)}
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
                                        value={exp.endDate}
                                        onChange={(e) => handleExperienceChange(index, e)}
                                        className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                    />
                                </div>

                                <div className="col-span-full">
                                    <label className="block text-sm font-medium">Bullet Points</label>
                                    <div className="mt-2 space-y-3">
                                        {exp.bulletPoints.map((point, i) => (
                                            <div key={i} className="flex gap-2">
                                                <textarea
                                                    value={point}
                                                    onChange={(e) => handleBulletChange(index, i, e.target.value)}
                                                    placeholder={`Bullet point ${i + 1}`}
                                                    required
                                                    className="flex-grow rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600"
                                                />
                                                {exp.bulletPoints.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeBullet(index, i)}
                                                        className="text-red-500"
                                                    >
                                                        ✕
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addBullet(index)}
                                            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                                        >
                                            + Add another bullet point
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {experiences.length > 1 && (
                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={() => removeExperience(index)}
                                        className="text-red-500"
                                    >
                                        Remove this experience
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="flex justify-start">
                        <button
                            type="button"
                            onClick={addExperience}
                            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                        >
                            + Add another experience
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
