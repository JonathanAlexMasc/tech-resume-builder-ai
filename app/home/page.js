import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import AuthRedirectMessage from '@/components/AuthRedirectMessage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/forms/HomeForm';
import HeaderPage from '../header/page';

const HomePage = async () => {
    const session = await auth();
    if (!session?.user) {
        return <AuthRedirectMessage />;
    }
    return (
        <div>
            <Header />
            <HeaderPage />
            <Footer />
        </div>
    );
};

export default HomePage;