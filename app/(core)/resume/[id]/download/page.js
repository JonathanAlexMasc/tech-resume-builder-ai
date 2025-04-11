import React from 'react';
import { auth } from '@/auth';
import AuthRedirectMessage from '@/components/AuthRedirectMessage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DownloadForm from '@/forms/DownloadForm';

const DownloadsPage = async () => {
    const session = await auth();
    if (!session?.user) {
        return <AuthRedirectMessage />;
    }
    return (
        <div>
            <Header />
            <DownloadForm />
            <Footer />
        </div>
    );
};

export default DownloadsPage;