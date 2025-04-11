'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit } from 'react-icons/fa';

export default function HomePage() {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    <Link
                        href="/header"
                        className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-md text-base font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                    >
                        <FaPlus />
                        New Resume
                    </Link>
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
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition"
                            >
                                <h3 className="text-xl font-semibold mb-4">
                                    {resume.title || "Untitled Resume"}
                                </h3>
                                <Link
                                    href={`/resume/${resume.id}/edit`}
                                    className="inline-flex items-center gap-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                                >
                                    <FaEdit />
                                    Edit Resume
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
