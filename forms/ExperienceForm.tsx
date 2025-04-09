'use client';

import React from 'react';

export default function ExperienceForm() {
    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-8 bg-white dark:bg-black">
            <form className="w-full max-w-2xl bg-white dark:bg-black p-6 rounded-md shadow-md text-gray-900 dark:text-gray-100">
                <div className="space-y-12">
                    {/* Experience Section */}
                    <div className="border-b border-gray-300 dark:border-gray-700 pb-12">
                        <h2 className="text-base font-semibold">Experience</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Tell us about your recent work history or relevant experience.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/* Job Title */}
                            <div className="sm:col-span-3">
                                <label htmlFor="job-title" className="block text-sm font-medium">
                                    Job Title
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="job-title"
                                        name="job-title"
                                        type="text"
                                        placeholder="Software Engineer"
                                        className="block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>

                            {/* Company Name */}
                            <div className="sm:col-span-3">
                                <label htmlFor="company" className="block text-sm font-medium">
                                    Company
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="company"
                                        name="company"
                                        type="text"
                                        placeholder="Amazon"
                                        className="block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>

                            {/* Start Date */}
                            <div className="sm:col-span-3">
                                <label htmlFor="start-date" className="block text-sm font-medium">
                                    Start Date
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="start-date"
                                        name="start-date"
                                        type="month"
                                        className="block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>

                            {/* End Date */}
                            <div className="sm:col-span-3">
                                <label htmlFor="end-date" className="block text-sm font-medium">
                                    End Date
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="end-date"
                                        name="end-date"
                                        type="month"
                                        className="block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div className="col-span-full">
                                <label htmlFor="experience-description" className="block text-sm font-medium">
                                    Description
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="experience-description"
                                        name="experience-description"
                                        rows={4}
                                        placeholder="Describe what you worked on, achievements, and technologies used..."
                                        className="block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Back
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
}
