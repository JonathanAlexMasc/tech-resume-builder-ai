import React from 'react';
import { auth } from '@/auth';
import AuthRedirectMessage from '@/components/AuthRedirectMessage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExperienceForm from '@/forms/ExperienceForm';


const ExperiencePage = async () => {
    const session = await auth();
    if (!session?.user) {
        return <AuthRedirectMessage />;
    }
    return (
        <div>
            <Header />
            <ExperienceForm />
            <Footer />
        </div>
    );
};

export default ExperiencePage;