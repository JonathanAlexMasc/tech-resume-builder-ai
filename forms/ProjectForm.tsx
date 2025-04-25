'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProjectForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [savedStates, setSavedStates] = useState({});

    const [suggestionsMap, setSuggestionsMap] = useState({});
    const [loadingSuggestions, setLoadingSuggestions] = useState(null); // track loading key

    useEffect(() => {
        async function fetchProjects() {
            if (!resumeId) return;

            const res = await fetch(`/api/resume/project?resumeId=${resumeId}`);
            if (!res.ok) {
                console.error('Failed to load projects');
                setLoading(false);
                return;
            }

            const data = await res.json();

            // console.log("Data from GET: ", data)

            if (data.projects?.length > 0) {
                setProjects(
                    data.projects.map((p) => ({
                        id: p.id,
                        title: p.title || '',
                        bulletPoints: p.bulletPoints.map((b) => ({ id: b.id, content: b.content })) || [{ content: '' }],
                    }))
                );
            }

            setLoading(false);
        }

        fetchProjects();
    }, [resumeId]);

    const handleTitleChange = (index, value) => {
        const updated = [...projects];
        updated[index].title = value;
        setProjects(updated);
    };

    const handleBulletChange = (projIndex, bulletIndex, value) => {
        const updated = [...projects];
        updated[projIndex].bulletPoints[bulletIndex].content = value;
        setProjects(updated);
    };

    const addBullet = (projIndex) => {
        const updated = [...projects];
        updated[projIndex].bulletPoints.push({ content: '' });
        setProjects(updated);
    };

    const removeBullet = async (projIndex, bulletIndex) => {
        const bullet = projects[projIndex].bulletPoints[bulletIndex];

        if (bullet.id) {
            const res = await fetch(`/api/resume/bullet?id=${bullet.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                return alert('Failed to delete bullet point');
            }
        }

        const updated = [...projects];
        updated[projIndex].bulletPoints.splice(bulletIndex, 1);
        setProjects(updated);
    };

    const addProject = () => {
        setProjects([
            ...projects,
            {
                title: '',
                bulletPoints: [{ content: '' }],
            },
        ]);
    };

    const removeProject = async (index) => {
        const proj = projects[index];

        if (proj.id) {
            const res = await fetch(`/api/resume/project?id=${proj.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                return alert('Failed to delete project');
            }
        }

        setProjects(projects.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e, proj, index) => {
        e.preventDefault();

        const method = proj.id ? 'PUT' : 'POST';

        // console.log("Project ID: ", proj)

        const res = await fetch('/api/resume/project', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: proj.id,
                resumeId,
                title: proj.title,
            }),
        });

        if (!res.ok) return alert('Failed to save project');

        // ✅ After successfully saving project and bullets
        setSavedStates(prev => ({
            ...prev,
            [index]: true,
        }));

        setTimeout(() => {
            setSavedStates(prev => ({
                ...prev,
                [index]: false,
            }));
        }, 3000); // Saved! message disappears after 3 seconds

        const { project } = await res.json();

        // ✅ Update local project ID after creation
        const updatedProjects = [...projects];
        updatedProjects[index].id = project.id;
        setProjects(updatedProjects);

        // Save bullet points
        const bulletRes = await Promise.all(
            proj.bulletPoints
                .filter((b) => b.content.trim() !== '')
                .map((b) => {
                    if (b.id) {
                        return fetch('/api/resume/bullet', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: b.id, content: b.content }),
                        });
                    } else {
                        return fetch('/api/resume/bullet', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ projectId: project.id, content: b.content }),
                        });
                    }
                })
        );

        if (!bulletRes.every((res) => res.ok)) {
            return alert('Some bullet points failed to save');
        }
    };

    const fetchSuggestions = async (projIndex, bulletIndex) => {
        const { title, bulletPoints } = projects[projIndex];
        const bulletText = bulletPoints[bulletIndex].content;

        setLoadingSuggestions(`${projIndex}-${bulletIndex}`);

        const res = await fetch('/api/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                role: 'Project Contributor',
                company: title || 'Untitled Project',
                rawBulletPoint: bulletText,
            }),
        });

        const data = await res.json();

        setSuggestionsMap((prev) => ({
            ...prev,
            [`${projIndex}-${bulletIndex}`]: data.suggestions || [],
        }));

        setLoadingSuggestions(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    Loading project data...
                </p>
            </div>
        );
    }

    return (
        <div className="px-4 py-8 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center">Projects</h2>

            {projects.length === 0 && (
                <div className="flex justify-center">
                    <button
                        onClick={addProject}
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                        + Add Project
                    </button>
                </div>
            )}

            {projects.map((proj, index) => (
                <form
                    key={index}
                    onSubmit={(e) => handleSubmit(e, proj, index)}
                    className="max-w-2xl mx-auto mb-10 bg-white dark:bg-gray-900 p-6 rounded-md shadow-md space-y-6"
                >
                    <h3 className="text-base font-semibold">Project {index + 1}</h3>

                    <input
                        type="text"
                        name="title"
                        value={proj.title}
                        onChange={(e) => handleTitleChange(index, e.target.value)}
                        placeholder="e.g. AI Resume Builder"
                        required
                        className="w-full rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                    />

                    <div>
                        <label className="block mb-1 text-sm font-medium">Bullet Points</label>
                        <div className="space-y-3">
                            {proj.bulletPoints.map((point, i) => (
                                <div key={point.id || i} className="flex flex-col gap-1">
                                    <div className="flex gap-2">
                                        <textarea
                                            value={point.content}
                                            onChange={(e) => handleBulletChange(index, i, e.target.value)}
                                            placeholder={`Bullet point ${i + 1}`}
                                            required
                                            className="flex-grow rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                                        />
                                        {proj.bulletPoints.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeBullet(index, i)}
                                                className="text-red-500"
                                            >
                                                ✕
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => fetchSuggestions(index, i)}
                                            className="text-blue-500 text-sm px-2"
                                        >
                                            ✨
                                        </button>
                                    </div>

                                    {/* Suggestions */}
                                    {loadingSuggestions === `${index}-${i}` ? (
                                        <p className="text-xs text-gray-500">Loading suggestions...</p>
                                    ) : (
                                        suggestionsMap[`${index}-${i}`]?.map((sug, si) => (
                                            <button
                                                key={si}
                                                onClick={() => handleBulletChange(index, i, sug)}
                                                className="text-left text-sm bg-gray-100 dark:bg-gray-700 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 w-full"
                                            >
                                                {sug}
                                            </button>
                                        ))
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addBullet(index)}
                                className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                            >
                                + Add another bullet point
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => removeProject(index)}
                            className="text-red-500 text-sm"
                        >
                            Remove Project
                        </button>

                        <div className="flex items-center gap-4">
                            {savedStates[index] && (
                                <p className="text-green-500 text-sm font-medium">Saved!</p>
                            )}
                            <button
                                type="submit"
                                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                            >
                                Save Project
                            </button>
                        </div>
                    </div>
                </form>
            ))}

            {projects.length > 0 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={addProject}
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                        + Add Another Project
                    </button>
                </div>
            )}
        </div>
    );
}
