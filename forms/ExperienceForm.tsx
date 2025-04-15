'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ExperienceForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchExperiences() {
            if (!resumeId) return;

            const res = await fetch(`/api/resume/experience?resumeId=${resumeId}`);
            if (!res.ok) {
                console.error('Failed to load experiences');
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (data.experiences?.length > 0) {
                setExperiences(
                    data.experiences.map((exp) => ({
                        id: exp.id,
                        role: exp.role || '',
                        company: exp.company || '',
                        location: exp.location || '',
                        startDate: exp.startDate?.slice(0, 7) || '',
                        endDate: exp.endDate?.slice(0, 7) || '',
                        bulletPoints: exp.bulletPoints.map((b) => ({ id: b.id, content: b.content })) || [{ content: '' }],
                    }))
                );
            }

            setLoading(false);
        }

        fetchExperiences();
    }, [resumeId]);

    const handleChange = (index, field, value) => {
        const updated = [...experiences];
        updated[index][field] = value;
        setExperiences(updated);
    };

    const handleBulletChange = (expIndex, bulletIndex, value) => {
        const updated = [...experiences];
        updated[expIndex].bulletPoints[bulletIndex].content = value;
        setExperiences(updated);
    };

    const addBullet = (expIndex) => {
        const updated = [...experiences];
        updated[expIndex].bulletPoints.push({ content: '' });
        setExperiences(updated);
    };

    const removeBullet = async (expIndex, bulletIndex) => {
        const bullet = experiences[expIndex].bulletPoints[bulletIndex];

        if (bullet.id) {
            const res = await fetch(`/api/resume/bullet?id=${bullet.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                return alert('Failed to delete bullet point');
            }
        }

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
                bulletPoints: [{ content: '' }],
            },
        ]);
    };

    const removeExperience = async (index) => {
        const exp = experiences[index];

        if (exp.id) {
            const res = await fetch(`/api/resume/experience?id=${exp.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                return alert('Failed to delete experience from the database.');
            }
        }

        setExperiences(experiences.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e, exp, index) => {
        e.preventDefault();

        const method = exp.id ? 'PUT' : 'POST';
        const url = '/api/resume/experience';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: exp.id,
                resumeId,
                role: exp.role,
                company: exp.company,
                location: exp.location,
                startDate: `${exp.startDate}-01`,
                endDate: exp.endDate ? `${exp.endDate}-01` : null,
            }),
        });

        if (!res.ok) return alert('Failed to save experience');
        const { experience } = await res.json();

        const bulletRes = await Promise.all(
            exp.bulletPoints
                .filter((b) => b.content.trim() !== '')
                .map((b) => {
                    if (b.id) {
                        return fetch('/api/resume/bullet', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: b.id, content: b.content }),
                        });
                    } else {
                        return fetch('/api/resume/bullet', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ experienceId: experience.id, content: b.content }),
                        });
                    }
                })
        );

        if (!bulletRes.every((res) => res.ok)) {
            return alert('Some bullet points failed to save');
        }

        alert('Experience saved!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    Loading experience data...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-8 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center">Experience</h2>

            {experiences.length === 0 && (
                <div className="flex justify-center">
                    <button
                        onClick={addExperience}
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                        + Add Experience
                    </button>
                </div>
            )}

            {experiences.map((exp, index) => (
                <form
                    key={index}
                    onSubmit={(e) => handleSubmit(e, exp, index)}
                    className="max-w-2xl mx-auto mb-10 bg-white dark:bg-gray-900 p-6 rounded-md shadow-md space-y-6"
                >
                    <h3 className="text-base font-semibold">Experience {index + 1}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="role"
                            value={exp.role}
                            onChange={(e) => handleChange(index, 'role', e.target.value)}
                            placeholder="Job Title"
                            required
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="text"
                            name="company"
                            value={exp.company}
                            onChange={(e) => handleChange(index, 'company', e.target.value)}
                            placeholder="Company"
                            required
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="text"
                            name="location"
                            value={exp.location}
                            onChange={(e) => handleChange(index, 'location', e.target.value)}
                            placeholder="Location"
                            required
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="month"
                            name="startDate"
                            value={exp.startDate}
                            onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                            required
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="month"
                            name="endDate"
                            value={exp.endDate}
                            onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Bullet Points</label>
                        <div className="space-y-3">
                            {exp.bulletPoints.map((point, i) => (
                                <div key={point.id || i} className="flex gap-2">
                                    <textarea
                                        value={point.content}
                                        onChange={(e) => handleBulletChange(index, i, e.target.value)}
                                        placeholder={`Bullet point ${i + 1}`}
                                        required
                                        className="flex-grow rounded-md px-3 py-2 bg-white dark:bg-gray-800"
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

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => removeExperience(index)}
                            className="text-red-500 text-sm"
                        >
                            Remove Experience
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Save Experience
                        </button>
                    </div>
                </form>
            ))}

            {experiences.length > 0 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={addExperience}
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                        + Add Another Experience
                    </button>
                </div>
            )}

            <div className="flex justify-end mt-8 max-w-2xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 mr-3"
                >
                    Back
                </button>
                <button
                    onClick={() => router.push(`/resume/projects?resumeId=${resumeId}`)}
                    className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
                >
                    Continue to Projects
                </button>
            </div>
        </div>
    );
}