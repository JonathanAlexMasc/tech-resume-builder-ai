'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EditResumePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function fetchResume() {
            if (!resumeId) return;

            try {
                const res = await fetch(`/api/resume?id=${resumeId}`);
                if (!res.ok) {
                    console.error('Failed to fetch resume');
                    return;
                }

                const data = await res.json();
                setName(data.resumes[0].name || '');
            } catch (error) {
                console.error('Error loading resume:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchResume();
    }, [resumeId]);

    console.log("name: ", name)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!resumeId) return;

        try {
            setSaving(true);
            const res = await fetch('/api/resume', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: resumeId,
                    name,
                }),
            });

            if (!res.ok) {
                alert('Failed to update resume name');
                return;
            }

            router.push(`/resume/header?resumeId=${resumeId}`);
        } catch (error) {
            console.error('Failed to update resume name:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Loading resume...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white dark:bg-gray-900 p-6 rounded-md shadow-md"
            >
                <h2 className="text-2xl font-bold mb-3 text-center">
                    Modify Metadata
                </h2>


                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Resume Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="My Awesome Resume"
                        className="w-full rounded-md px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600"
                    />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
}
