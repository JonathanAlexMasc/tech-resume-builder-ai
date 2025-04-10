import React from 'react';
import { auth } from '@/auth';
import AuthRedirectMessage from '@/components/AuthRedirectMessage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkillForm from '@/forms/SkillForm';


const SkillsPage = async () => {
    const session = await auth();
    if (!session?.user) {
        return <AuthRedirectMessage />;
    }
    return (
        <div>
            <Header />
            <SkillForm />
            <Footer />
        </div>
    );
};

export default SkillsPage;