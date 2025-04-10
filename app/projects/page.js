import React from 'react';
import { auth } from '@/auth';
import AuthRedirectMessage from '@/components/AuthRedirectMessage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProjectForm from '@/forms/ProjectForm';


const ProjectsPage = async () => {
    const session = await auth();
    if (!session?.user) {
        return <AuthRedirectMessage />;
    }
    return (
        <div>
            <Header />
            <ProjectForm />
            <Footer />
        </div>
    );
};

export default ProjectsPage;