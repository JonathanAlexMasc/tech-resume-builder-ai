'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { compileResume } from '@/lib/compileResume'; // 👈 import your helper here

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;
    const [reloadKey, setReloadKey] = useState(Date.now());
    const [hasCompiledOnce, setHasCompiledOnce] = useState(false);

    const reloadResume = () => {
        setReloadKey(Date.now());
    };

    const generateResume = async () => {
        if (resumeId) {
            await compileResume(resumeId); // 👈 call your helper
            setHasCompiledOnce(true);
        } else {
            alert('Missing resume ID');
        }
    };

    // Auto-generate first time
    useEffect(() => {
        if (resumeId && !hasCompiledOnce) {
            generateResume();
        }
    }, [resumeId]);

    // Broadcast listener
    useEffect(() => {
        if (!resumeId) return;

        const channel = new BroadcastChannel('resume_compile_channel');

        channel.onmessage = (event) => {
            const { type, resumeId: incomingResumeId } = event.data;
            if (type === 'compiled' && incomingResumeId === resumeId) {
                console.log('🔄 Detected compile for this resume, reloading iframe...');
                reloadResume();
            }
        };

        return () => {
            channel.close();
        };
    }, [resumeId]);

    return (
        <div className="flex flex-col">
            <div style={{ height: '100vh', width: '100%' }}>
                {resumeId && (
                    <iframe
                        key={reloadKey}
                        src={`/api/resume/view?resumeId=${resumeId}&t=${reloadKey}`}
                        width="100%"
                        height="100%"
                        style={{ border: 'none' }}
                    />
                )}
            </div>
        </div>
    );
}
