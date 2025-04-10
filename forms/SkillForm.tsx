'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SkillForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId'); // not expId!
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [skills, setSkills] = useState([
        { name: '', isLanguage: false, isFramework: false, isDev: false, isCloud: false }
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...skills];
        updated[index][field] = value;
        setSkills(updated);
    };

    const addSkill = () => {
        if (skills.length < 10) {
            setSkills([...skills, { name: '', isLanguage: false, isFramework: false, isDev: false, isCloud: false }]);
        }
    };

    const removeSkill = (index) => {
        setSkills(skills.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validSkills = skills.filter(skill => skill.name.trim() !== '');
        const responses = await Promise.all(
            validSkills.map((skill) =>
                fetch('/api/skill', {
                    method: 'POST',
                    body: JSON.stringify({ ...skill, resumeId }),
                    headers: { 'Content-Type': 'application/json' },
                })
            )
        );

        if (responses.every(res => res.ok)) {
            router.push(`/education?resumeId=${resumeId}`);
        } else {
            alert('Some skills failed to save');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto py-8">
            <h2 className="text-lg font-semibold">Add up to 10 Skills</h2>

            {skills.map((skill, index) => (
                <div key={index} className="border border-gray-300 dark:border-gray-700 p-4 rounded-md space-y-4">
                    <div className="flex items-center justify-between">
                        <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => handleChange(index, 'name', e.target.value)}
                            placeholder="Docker, JavaScript, AWS, etc."
                            required
                            className="w-full rounded-md px-3 py-2 border dark:bg-gray-800 dark:text-white"
                        />
                        {skills.length > 1 && (
                            <button type="button" onClick={() => removeSkill(index)} className="ml-3 text-red-500">
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <label>
                            <input
                                type="checkbox"
                                checked={skill.isLanguage}
                                onChange={(e) => handleChange(index, 'isLanguage', e.target.checked)}
                            />
                            <span className="ml-2">Language</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={skill.isFramework}
                                onChange={(e) => handleChange(index, 'isFramework', e.target.checked)}
                            />
                            <span className="ml-2">Framework</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={skill.isDev}
                                onChange={(e) => handleChange(index, 'isDev', e.target.checked)}
                            />
                            <span className="ml-2">Dev Tool</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={skill.isCloud}
                                onChange={(e) => handleChange(index, 'isCloud', e.target.checked)}
                            />
                            <span className="ml-2">Cloud Tool</span>
                        </label>
                    </div>
                </div>
            ))}

            {skills.length < 10 && (
                <button
                    type="button"
                    onClick={addSkill}
                    className="text-sm mr-5 text-indigo-600 dark:text-indigo-400 font-medium"
                >
                    + Add another skill
                </button>
            )}

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button onClick={() => router.back()} type="button" className="text-sm font-semibold text-gray-900 dark:text-white mr-2">
                    Back
                </button>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-500"
                >
                    Save
                </button>
            </div>
        </form>
    );
}
