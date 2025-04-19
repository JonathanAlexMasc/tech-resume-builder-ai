import React from "react";

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { logoutAction } from '@/app/actions';
import { FaSignOutAlt } from 'react-icons/fa';
import { auth } from "@/auth";

export default async function Avatar() {
    const session = await auth();
    const user = session.user;
    const imageUrl = user?.image || "https://via.placeholder.com/150";
    
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <MenuButton className="inline-block size-10 rounded-full ring-2 ring-white">
                    <div className="flex -space-x-2 overflow-hidden">
                        <img
                            alt=""
                            src={imageUrl}
                            className="inline-block size-10 rounded-full ring-2 ring-white"
                        />
                    </div>
                </MenuButton>
            </div>

            <MenuItems
                transition
                className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
                <div className="py-1">
                    <MenuItem>
                        <a
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                            Profile
                        </a>
                    </MenuItem>
                </div>
                <div className="py-1">
                    <MenuItem>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                            Subscription
                        </a>
                    </MenuItem>
                    <MenuItem>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                            Move
                        </a>
                    </MenuItem>
                </div>
                <div className="py-1">
                    <MenuItem>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                            Share
                        </a>
                    </MenuItem>
                    <MenuItem>
                        <a
                            href="#"
                            className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                        >
                            Add to favorites
                        </a>
                    </MenuItem>
                </div>
                <div className="py-1">
                    <MenuItem>
                        <form action={logoutAction} className="flex justify-start px-4 py-2">
                            <button
                                type="submit"
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-4 rounded-md shadow transition"
                            >
                                <FaSignOutAlt className="w-4 h-4" />
                                Logout
                            </button>
                        </form>
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    )
}

