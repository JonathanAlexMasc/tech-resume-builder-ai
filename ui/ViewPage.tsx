'use client';

import React from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import HeaderForm from '@/forms/HeaderForm';
import ExperienceForm from '@/forms/ExperienceForm';
import ProjectForm from '@/forms/ProjectForm';
import EducationForm from '@/forms/EducationForm';
import SkillForm from '@/forms/SkillForm';
import DownloadForm from '@/forms/DownloadForm';
import PreviewPage from './PreviewPage';

export default function ViewPage() {
    return (
        <PanelGroup direction="horizontal" className="h-[90vh]">
            {/* LEFT SIDE (Forms) */}
            <Panel defaultSize={50} minSize={30}>
                <div className="flex flex-col max-h-[80vh] overflow-y-auto p-4">
                    <HeaderForm />
                    <ExperienceForm />
                    <ProjectForm />
                    <EducationForm />
                    <SkillForm />
                </div>
            </Panel>

            {/* DRAG HANDLE */}
            <PanelResizeHandle className="w-2 bg-gray-300 hover:bg-gray-400 cursor-col-resize" />

            {/* RIGHT SIDE (Preview) */}
            <Panel defaultSize={50} minSize={30}>
                <div className="h-full w-full p-4">
                    <PreviewPage />
                </div>
            </Panel>
        </PanelGroup>
    );
}
