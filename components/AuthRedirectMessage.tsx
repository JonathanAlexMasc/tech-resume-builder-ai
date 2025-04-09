'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import React from 'react';

const AuthRedirectMessage = () => {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.push('/');
        }, 3000); // wait 3 seconds before redirect

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h2 className="text-xl font-semibold">You must be signed in to access this page.</h2>
            <p>Redirecting to the homepage...</p>
        </div>
    );
};

export default AuthRedirectMessage;
