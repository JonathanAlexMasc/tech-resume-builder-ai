'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmModal from "@/components/ConfirmModal"; // import modal

export default function HomePage() {
    const router = useRouter();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState(null);

    const handleCreateResume = async () => {
        try {
            const res = await fetch('/api/resume', { method: 'POST' });
            if (!res.ok) throw new Error('Failed to create resume');
            const data = await res.json();
            router.push(`/resume/resume-meta?resumeId=${data.resume.id}`);
        } catch (err) {
            console.error('Error creating resume:', err);
        }
    };

    const handleDelete = (id) => {
        setSelectedResumeId(id);
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        if (!selectedResumeId) return;
        await fetch(`/api/resume?id=${selectedResumeId}`, { method: 'DELETE' });
        setResumes(resumes.filter((r) => r.id !== selectedResumeId));
        setShowConfirm(false);
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
            <div className="max-w-5xl mx-auto">
                {/* Confirmation Modal */}
                <ConfirmModal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={confirmDelete}
                    title="Delete Resume"
                    message="Are you sure you want to delete this resume? This action cannot be undone."
                />

                {/* Rest of your content */}
                {/* Same list layout as you already have */}
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {resumes.map((resume) => (
                        <li key={resume.id} className="flex justify-between gap-x-6 p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200">
                            <div className="min-w-0 flex-auto">
                                <p className="text-lg font-semibold">{resume.name || 'Untitled Resume'}</p>
                            </div>

                            {/* Actions */}
                            <div className="hidden shrink-0 sm:flex sm:items-center gap-4">
                                <Link href={`/resume/resume-meta?resumeId=${resume.id}`} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                    </svg>
                                </Link>

                                <button
                                    onClick={() => handleDelete(resume.id)}
                                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                {/* New Resume Button at Bottom */}
                <div className="flex justify-center mt-12">
                    <button
                        onClick={handleCreateResume}
                        className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-6 py-3 rounded-md text-base font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create New Resume
                    </button>
                </div>
            </div>
        </div>
    );
}
