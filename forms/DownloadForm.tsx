'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function DownloadForm() {
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [isDownloading, setIsDownloading] = useState(false);

    const generateResume = async () => {
        if (!resumeId) {
            alert('Missing resume ID');
            return;
        }

        setIsDownloading(true);

        try {
            const res = await fetch(`/api/resume/compile/resumeId=${resumeId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resumeId }),
            });

            const contentType = res.headers.get('Content-Type') || '';

            if (!res.ok) {
                // Only try to parse JSON if content-type is JSON
                if (contentType.includes('application/json')) {
                    const { error } = await res.json();
                    throw new Error(error || 'Resume generation failed.');
                } else {
                    const text = await res.text(); // read raw HTML or plain text once
                    console.error('Unexpected error response:', text);
                    throw new Error('Resume generation failed with non-JSON error.');
                }
            }

            // If successful, get the PDF blob
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resume.pdf';
            link.click();
        } catch (error) {
            console.error('Error generating resume:', error);
            alert(error.message || 'An unexpected error occurred.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-xl mx-auto py-8">
            <h2 className="text-lg font-semibold">Download Your Resume</h2>

            <p className="text-sm text-gray-600 dark:text-gray-300">
                Click the button below to generate and download a PDF version of your resume.
            </p>

            <button
                type="button"
                onClick={generateResume}
                disabled={isDownloading}
                className="rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500 disabled:opacity-50"
            >
                {isDownloading ? 'Generating...' : 'Download Resume'}
            </button>
        </div>
    );
}
