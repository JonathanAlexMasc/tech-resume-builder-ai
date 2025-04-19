import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import AuthRedirectMessage from '@/components/AuthRedirectMessage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';

const LandingPage = async () => {
    const session = await auth();
    if (!session?.user) {
        return <AuthRedirectMessage />;
    }
    return (
        <div>
            <Header />
            <HomePage />
            <Footer />
        </div>
    );
};

export default LandingPage;