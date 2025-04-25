'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;
    const [reloadKey, setReloadKey] = useState(Date.now());
    const [hasCompiledOnce, setHasCompiledOnce] = useState(false);

    const generateResume = async () => {
        if (!resumeId) {
            alert('Missing resume ID');
            return;
        }

        try {
            const res = await fetch(`/api/resume/compile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error('Unexpected error response:', text);
                throw new Error('Resume generation failed.');
            }

            setReloadKey(Date.now()); // Force iframe refresh
            setHasCompiledOnce(true); // Mark it as compiled
        } catch (error) {
            console.error('Error generating resume:', error);
            alert(error.message || 'An unexpected error occurred.');
        }
    };

    // 🧠 Auto-compile the first time the page loads
    useEffect(() => {
        if (resumeId && !hasCompiledOnce) {
            generateResume();
        }
    }, [resumeId]);

    return (
        <div className='flex flex-col'>
            <button
                onClick={generateResume}
                className="flex w-fit self-end rounded-md bg-indigo-600 px-2 py-2 mb-4 text-sm font-semibold text-white hover:bg-indigo-500"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
            </button>

            <div style={{ height: '100vh', width: '100%' }}>
                {resumeId && (
                    <iframe
                        key={reloadKey}
                        src={`/api/resume/view?resumeId=${resumeId}`}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                    />
                )}
            </div>
        </div>
    );
}
