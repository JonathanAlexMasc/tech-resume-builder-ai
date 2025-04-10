'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';

export default function ExperienceForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [form, setForm] = useState({
        role: '',
        company: '',
        startDate: '',
        endDate: '',
    });
    const [bulletPoints, setBulletPoints] = useState(['']);

    const handleFormChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleBulletChange = (index, value) => {
        const updated = [...bulletPoints];
        updated[index] = value;
        setBulletPoints(updated);
    };

    const addBullet = () => {
        setBulletPoints([...bulletPoints, '']);
    };

    const removeBullet = (index) => {
        setBulletPoints(bulletPoints.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const experienceRes = await fetch('/api/experience', {
            method: 'POST',
            body: JSON.stringify({
                resumeId,
                role: form.role,
                company: form.company,
                startDate: `${form.startDate}-01`, // convert "YYYY-MM" to full date
                endDate: form.endDate ? `${form.endDate}-01` : null,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!experienceRes.ok) return alert('Failed to save experience');

        const { experience } = await experienceRes.json();

        const bulletRes = await Promise.all(
            bulletPoints
                .filter((point) => point.trim() !== '')
                .map((content) =>
                    fetch('/api/bullet', {
                        method: 'POST',
                        body: JSON.stringify({ experienceId: experience.id, content }),
                        headers: { 'Content-Type': 'application/json' },
                    })
                )
        );

        if (bulletRes.every((res) => res.ok)) {
            router.push(`/projects?resumeId=${resumeId}`);
        } else {
            alert('Some bullet points failed to save');
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-8 bg-white dark:bg-black">
            <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white dark:bg-black p-6 rounded-md shadow-md text-gray-900 dark:text-gray-100">
                <div className="space-y-12">
                    <div className="border-b border-gray-300 dark:border-gray-700 pb-12">
                        <h2 className="text-base font-semibold">Experience</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Tell us about your recent work history or relevant experience.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                                <label htmlFor="role" className="block text-sm font-medium">Job Title</label>
                                <input
                                    id="role"
                                    name="role"
                                    type="text"
                                    value={form.role}
                                    onChange={handleFormChange}
                                    placeholder="Software Engineer"
                                    required
                                    className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                                />
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="company" className="block text-sm font-medium">Company</label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    value={form.company}
                                    onChange={handleFormChange}
                                    placeholder="Amazon"
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

                            {/* Bullet Points */}
                            <div className="col-span-full">
                                <label className="block text-sm font-medium">Bullet Points</label>
                                <div className="mt-2 space-y-3">
                                    {bulletPoints.map((point, index) => (
                                        <div key={index} className="flex gap-2">
                                            <textarea
                                                value={point}
                                                onChange={(e) => handleBulletChange(index, e.target.value)}
                                                placeholder={`Bullet point ${index + 1}`}
                                                required
                                                className="flex-grow rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600"
                                            />
                                            {bulletPoints.length > 1 && (
                                                <button type="button" onClick={() => removeBullet(index)} className="text-red-500">
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addBullet}
                                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                                    >
                                        + Add another bullet point
                                    </button>
                                </div>
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
