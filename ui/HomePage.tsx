'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmModal from "@/components/ConfirmModal";

export default function HomePage() {
    const router = useRouter();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editedName, setEditedName] = useState('');

    const handleCreateResume = async () => {
        try {
            const res = await fetch('/api/resume', { method: 'POST' });
            if (!res.ok) throw new Error('Failed to create resume');
            const data = await res.json();
            router.push(`/resume/header?resumeId=${data.resume.id}`);
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

    const handleSaveName = async (resumeId) => {
        try {
            const res = await fetch('/api/resume', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: resumeId, name: editedName }),
            });

            if (!res.ok) {
                throw new Error('Failed to update name');
            }

            // Update the local state
            setResumes((prev) =>
                prev.map((resume) =>
                    resume.id === resumeId ? { ...resume, name: editedName } : resume
                )
            );

            setEditingId(null);
            setEditedName('');
        } catch (error) {
            console.error('Failed to update name:', error);
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
            <div className="max-w-5xl mx-auto">
                {/* Confirmation Modal */}
                <ConfirmModal
                    isOpen={showConfirm}
                    onClose={() => setShowConfirm(false)}
                    onConfirm={confirmDelete}
                    title="Delete Resume"
                    message="Are you sure you want to delete this resume? This action cannot be undone."
                />

                {/* Resume list */}
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                    {resumes.map((resume) => (
                        <li
                            key={resume.id}
                            className="flex justify-between gap-x-6 my-3 p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 cursor-pointer"
                            onClick={() => router.push(`/resume/header?resumeId=${resume.id}`)}
                        >
                            <div className="min-w-0 flex-auto">
                                {editingId === resume.id ? (
                                    <input
                                        type="text"
                                        value={editedName}
                                        onChange={(e) => setEditedName(e.target.value)}
                                        onClick={(e) => e.stopPropagation()}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSaveName(resume.id);
                                            }
                                        }}
                                        className="text-lg font-semibold bg-white dark:bg-gray-800 px-2 py-1 rounded-md w-full"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="text-lg font-semibold">{resume.name || 'Untitled Resume'}</p>
                                )}
                            </div>

                            <div
                                className="hidden shrink-0 sm:flex sm:items-center gap-4"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {editingId === resume.id ? (
                                    <button
                                        onClick={() => handleSaveName(resume.id)}
                                        className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setEditingId(resume.id);
                                            setEditedName(resume.name || '');
                                        }}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                                        </svg>
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(resume.id)}
                                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* New Resume Button */}
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
