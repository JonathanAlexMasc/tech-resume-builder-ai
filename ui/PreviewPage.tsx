'use client';

import { useSearchParams } from 'next/navigation';
import React from 'react';
import { useState } from 'react';

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;
    const [reloadKey, setReloadKey] = useState(Date.now());

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

            const contentType = res.headers.get('Content-Type') || '';

            if (!res.ok) {
                const text = await res.text(); // read raw HTML or plain text once
                console.error('Unexpected error response:', text);
                throw new Error('Resume generation failed with non-JSON error.');
            }

            setReloadKey(Date.now());
        } catch (error) {
            console.error('Error generating resume:', error);
            alert(error.message || 'An unexpected error occurred.');
        }
    };

    return (
        <div>
            <button
                onClick={generateResume}
                className="flex rounded-md bg-indigo-600 px-2 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
                Compile
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
function setReloadKey(arg0: number) {
    throw new Error('Function not implemented.');
}

