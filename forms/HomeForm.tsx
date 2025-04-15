'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const handleCreateResume = async () => {
        try {
            const res = await fetch('/api/resume', {
                method: 'POST',
            });

            if (!res.ok) {
                throw new Error('Failed to create resume');
            }
            const data = await res.json();
            const resumeId = data.resume.id;
            router.push(`/resume/header?resumeId=${resumeId}`);
        } catch (err) {
            console.error('Error creating resume:', err);
        }
    };

    useEffect(() => {
        async function fetchResumes() {
            try {
                const res = await fetch('/api/resume');
                const data = await res.json();
                setResumes(data.resumes || []);
            } catch (error) {
                console.error('Failed to fetch resumes:', error);
                setResumes([]);
            } finally {
                setLoading(false);
            }
        }

        fetchResumes();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white px-4 sm:px-6 lg:px-16 py-16">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold">Your Resumes</h1>
                    <button
                        onClick={handleCreateResume}
                        className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md text-base font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                    >
                        <FaPlus />
                        New Resume
                    </button>
                </div>

                {loading ? (
                    <p className="text-xl text-gray-500 dark:text-gray-400">Loading resumes...</p>
                ) : resumes.length === 0 ? (
                    <p className="text-xl text-gray-500 dark:text-gray-400">
                        No resumes yet. Click “New Resume” to get started.
                    </p>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                                {resumes.map((resume) => (
                                    <div
                                        key={resume.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition space-y-4"
                                    >
                                        <input
                                            type="text"
                                            value={resume.name || ''}
                                            onChange={(e) => {
                                                const updated = resumes.map((r) =>
                                                    r.id === resume.id ? { ...r, name: e.target.value } : r
                                                );
                                                setResumes(updated);
                                            }}
                                            placeholder="Resume Name"
                                            className="w-full rounded-md bg-white dark:bg-gray-800 px-3 py-2 border"
                                        />

                                        <div className="flex justify-between items-center">
                                            <Link
                                                href={`/resume/header?resumeId=${resume.id}`}
                                                className="inline-flex items-center gap-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                                            >
                                                <FaEdit />
                                                Edit
                                            </Link>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={async () => {
                                                        await fetch(`/api/resume`, {
                                                            method: 'PUT',
                                                            headers: { 'Content-Type': 'application/json' },
                                                            body: JSON.stringify({ id: resume.id, name: resume.name }),
                                                        });
                                                    }}
                                                    className="text-sm px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                                                >
                                                    Save Name
                                                </button>

                                                <button
                                                    onClick={async () => {
                                                        await fetch(`/api/resume?id=${resume.id}`, {
                                                            method: 'DELETE',
                                                        });
                                                        setResumes(resumes.filter((r) => r.id !== resume.id));
                                                    }}
                                                    className="text-sm px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                    </div>
                )}
            </div>
        </div>
    );
}
