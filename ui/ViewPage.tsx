'use client';

import React, { useEffect, useState } from 'react';
import HeaderForm from '@/forms/HeaderForm';
import ExperienceForm from '@/forms/ExperienceForm';
import ProjectForm from '@/forms/ProjectForm';
import EducationForm from '@/forms/EducationForm';
import SkillForm from '@/forms/SkillForm';
import DownloadForm from '@/forms/DownloadForm';
import PreviewPage from './PreviewPage';

export default function ViewPage() {
    return (
        <div className='flex'>
            <div className='flex flex-col grow max-h-[80vh] overflow-y-auto'>
                <HeaderForm />
                <ExperienceForm />
                <ProjectForm />
                <EducationForm />
                <SkillForm />
                <DownloadForm />
            </div>
            <div className='grow'>
                <PreviewPage />
            </div>
        </div>
    );
}
