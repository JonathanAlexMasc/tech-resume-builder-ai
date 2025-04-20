import React from 'react';
import { auth } from '@/auth';
import AuthRedirectMessage from '@/components/AuthRedirectMessage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EditResumePage from '@/ui/EditResumePage';


const ResumeMetaDataPage = async () => {
    const session = await auth();
    if (!session?.user) {
        return <AuthRedirectMessage />;
    }
    return (
        <div>
            <Header />
            <EditResumePage />
            <Footer />
        </div>
    );
};

export default ResumeMetaDataPage;