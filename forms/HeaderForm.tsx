'use client';

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import React from 'react';

export default function HeaderForm() {
    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-8 bg-white dark:bg-black">
            <form className="bg-white dark:bg-black p-6 rounded-md shadow-md text-gray-900 dark:text-gray-100">
                <div className="space-y-12">
                    {/* Profile Section */}
                    <div className="border-b border-gray-300 dark:border-gray-700 pb-12">
                        <h2 className="text-base font-semibold">Profile</h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            This information will be displayed publicly so be careful what you share.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            {/* Username */}
                            <div className="sm:col-span-4">
                                <label htmlFor="username" className="block text-sm font-medium">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <div className="flex items-center rounded-md bg-white dark:bg-gray-800 pl-3 outline outline-1 outline-gray-300 dark:outline-gray-600 focus-within:outline-2 focus-within:outline-indigo-600">
                                        <span className="shrink-0 text-gray-500 sm:text-sm">workcation.com/</span>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="janesmith"
                                            className="block grow bg-transparent py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* About */}
                            <div className="col-span-full">
                                <label htmlFor="about" className="block text-sm font-medium">
                                    About
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="about"
                                        name="about"
                                        rows={3}
                                        className="block w-full rounded-md bg-white dark:bg-gray-800 px-3 py-1.5 text-base text-gray-900 dark:text-white outline outline-1 outline-gray-300 dark:outline-gray-600 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600"
                                        defaultValue={''}
                                    />
                                </div>
                                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                    Write a few sentences about yourself.
                                </p>
                            </div>

                            {/* Photo */}
                            <div className="col-span-full">
                                <label htmlFor="photo" className="block text-sm font-medium">
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    <UserCircleIcon aria-hidden="true" className="w-12 h-12 text-gray-300" />
                                    <button
                                        type="button"
                                        className="rounded-md bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>

                            {/* Cover Photo */}
                            <div className="col-span-full">
                                <label htmlFor="cover-photo" className="block text-sm font-medium">
                                    Cover photo
                                </label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-100/20 px-6 py-10">
                                    <div className="text-center">
                                        <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-300" />
                                        <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer rounded-md bg-white dark:bg-gray-800 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus-within:outline-none"
                                            >
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add any other sections here... */}
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold text-gray-900 dark:text-white">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div> 
    );
}
