'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EducationForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const resumeIdParam = searchParams.get('resumeId');
    const resumeId = resumeIdParam ? parseInt(resumeIdParam, 10) : null;

    const [educations, setEducations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchEducations() {
            if (!resumeId) return;

            const res = await fetch(`/api/resume/education/resumeId=${resumeId}`);
            if (!res.ok) {
                console.error('Failed to load education');
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (data.education?.length > 0) {
                setEducations(data.education.map((edu) => ({
                    id: edu.id,
                    school: edu.school,
                    location: edu.location,
                    startDate: edu.startDate?.slice(0, 7) || '',
                    endDate: edu.endDate?.slice(0, 7) || '',
                    major: edu.major,
                })));
            }

            setLoading(false);
        }

        fetchEducations();
    }, [resumeId]);

    const handleChange = (index, field, value) => {
        const updated = [...educations];
        updated[index][field] = value;
        setEducations(updated);
    };

    const addEducation = () => {
        setEducations([
            ...educations,
            {
                school: '',
                location: '',
                startDate: '',
                endDate: '',
                major: '',
            },
        ]);
    };

    const removeEducation = async (index) => {
        const edu = educations[index];

        if (edu.id) {
            const res = await fetch(`/api/resume/education?id=${edu.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                return alert('Failed to delete education entry');
            }
        }

        setEducations(educations.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e, edu, index) => {
        e.preventDefault();

        const method = edu.id ? 'PUT' : 'POST';

        const res = await fetch('/api/resume/education', {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: edu.id,
                resumeId,
                school: edu.school,
                location: edu.location,
                startDate: `${edu.startDate}-01`,
                endDate: edu.endDate ? `${edu.endDate}-01` : null,
                major: edu.major,
            }),
        });

        if (!res.ok) return alert('Failed to save education');

        alert('Education saved!');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    Loading education data...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-8 bg-white dark:bg-black text-gray-900 dark:text-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-center">Education</h2>

            {educations.length === 0 && (
                <div className="flex justify-center">
                    <button
                        onClick={addEducation}
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                        + Add Education
                    </button>
                </div>
            )}

            {educations.map((edu, index) => (
                <form
                    key={edu.id || index}
                    onSubmit={(e) => handleSubmit(e, edu, index)}
                    className="max-w-2xl mx-auto mb-10 bg-white dark:bg-gray-900 p-6 rounded-md shadow-md space-y-6"
                >
                    <h3 className="text-base font-semibold">Education {index + 1}</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="school"
                            value={edu.school}
                            onChange={(e) => handleChange(index, 'school', e.target.value)}
                            placeholder="School/University"
                            required
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="text"
                            name="location"
                            value={edu.location}
                            onChange={(e) => handleChange(index, 'location', e.target.value)}
                            placeholder="Location"
                            required
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="month"
                            name="startDate"
                            value={edu.startDate}
                            onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                            required
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                        />
                        <input
                            type="month"
                            name="endDate"
                            value={edu.endDate}
                            onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium">Major</label>
                        <input
                            type="text"
                            name="major"
                            value={edu.major}
                            onChange={(e) => handleChange(index, 'major', e.target.value)}
                            placeholder="Computer Science"
                            required
                            className="rounded-md px-3 py-2 bg-white dark:bg-gray-800 w-full"
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="text-red-500 text-sm"
                        >
                            Remove Education
                        </button>
                        <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Save Education
                        </button>
                    </div>
                </form>
            ))}

            {educations.length > 0 && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={addEducation}
                        className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                    >
                        + Add Another Education
                    </button>
                </div>
            )}

            <div className="flex justify-end mt-8 max-w-2xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600 mr-3"
                >
                    Back
                </button>
                <button
                    onClick={() => router.push(`/api/resume/download?resumeId=${resumeId}`)}
                    className="rounded-md bg-gray-700 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-600"
                >
                    Download Resume
                </button>
            </div>
        </div>
    );
}
