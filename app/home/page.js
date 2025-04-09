import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Logout from '@/components/Logout';

const HomePage = async () => {
    const session = await auth();
    if (!session?.user) redirect('/');
    return (
        <div>
            <h1>Hello {session?.user?.name}, Welcome to Tech Resume Builder AI</h1>

            <Image
                src={session?.user?.image}
                alt={session?.user?.name}
                width={500}
                height={500} />
            
            <p>Here you can build your resume using AI.</p>

            <Logout />
            
        </div>
    );
};

export default HomePage;