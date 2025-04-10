'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProjectForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId'); // not expId!
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [title, setTitle] = useState('');
    const [bulletPoints, setBulletPoints] = useState(['']);

    const handleBulletChange = (index: number, value: string) => {
        const updated = [...bulletPoints];
        updated[index] = value;
        setBulletPoints(updated);
    };

    const addBullet = () => {
        setBulletPoints([...bulletPoints, '']);
    };

    const removeBullet = (index: number) => {
        setBulletPoints(bulletPoints.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!resumeId || isNaN(resumeId)) {
            alert('Invalid resume ID');
            return;
        }

        const projectRes = await fetch('/api/project', {
            method: 'POST',
            body: JSON.stringify({ resumeId, title }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!projectRes.ok) return alert('Failed to save project');

        const { project } = await projectRes.json();

        const bulletRes = await Promise.all(
            bulletPoints
                .filter((point) => point.trim() !== '')
                .map((content) =>
                    fetch('/api/bullet', {
                        method: 'POST',
                        body: JSON.stringify({ projectId: project.id, content }),
                        headers: { 'Content-Type': 'application/json' },
                    })
                )
        );

        if (bulletRes.every((res) => res.ok)) {
            router.push('/'); // Or wherever you want to go next
        } else {
            alert('Some bullet points failed to save');
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-8 bg-white dark:bg-black">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-2xl bg-white dark:bg-black p-6 rounded-md shadow-md text-gray-900 dark:text-gray-100"
            >
                <div className="space-y-12">
                    <div className="border-b border-gray-300 dark:border-gray-700 pb-12">
                        <h2 className="text-base font-semibold">Projects</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Add a project you worked on and describe your contributions.
                        </p>

                        {/* Project Title */}
                        <div className="mt-6">
                            <label htmlFor="title" className="block text-sm font-medium">
                                Project Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. AI Resume Builder"
                                required
                                className="mt-2 block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5"
                            />
                        </div>

                        {/* Bullet Points */}
                        <div className="mt-6">
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

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Back
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        Save Project
                    </button>
                </div>
            </form>
        </div>
    );
}
