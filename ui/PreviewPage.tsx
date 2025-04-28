'use client';

import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { compileResume } from '@/lib/compileResume';

export default function PreviewPage() {
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;
    const [reloadKey, setReloadKey] = useState(Date.now());
    const [hasCompiledOnce, setHasCompiledOnce] = useState(false);
    const [readyToShow, setReadyToShow] = useState(false); // 👈 new

    const reloadResume = () => {
        setReloadKey(Date.now());
    };

    const generateResume = async () => {
        if (resumeId) {
            await compileResume(resumeId);
            setHasCompiledOnce(true);
            setReadyToShow(true); // 👈 allow iframe to show now
        } else {
            alert('Missing resume ID');
        }
    };

    useEffect(() => {
        if (resumeId && !hasCompiledOnce) {
            generateResume();
        }
    }, [resumeId]);

    useEffect(() => {
        if (!resumeId) return;

        const channel = new BroadcastChannel('resume_compile_channel');

        channel.onmessage = (event) => {
            const { type, resumeId: incomingResumeId } = event.data;
            if (type === 'compiled' && incomingResumeId === resumeId) {
                console.log('🔄 Detected compile for this resume, reloading iframe...');
                reloadResume();
                setReadyToShow(true); // 👈 after recompile, allow showing again
            }
        };

        return () => {
            channel.close();
        };
    }, [resumeId]);

    return (
        <div className="flex flex-col">
            <div style={{ height: '100vh', width: '100%' }}>
                {resumeId && readyToShow && ( // 👈 only render iframe when ready
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
