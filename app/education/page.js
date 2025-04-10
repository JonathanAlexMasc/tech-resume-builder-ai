import React from 'react';
import { auth } from '@/auth';
import AuthRedirectMessage from '@/components/AuthRedirectMessage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EducationForm from '@/forms/EducationForm';


const EducationPage = async () => {
    const session = await auth();
    if (!session?.user) {
        return <AuthRedirectMessage />;
    }
    return (
        <div>
            <Header />
            <EducationForm />
            <Footer />
        </div>
    );
};

export default EducationPage;