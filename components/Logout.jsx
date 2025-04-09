'use client';

import { logoutAction } from '@/app/actions';
import { FaSignOutAlt } from 'react-icons/fa';

const Logout = () => {
    return (
        <form action={logoutAction} className="flex justify-center">
            <button
                type="submit"
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow transition"
            >
                <FaSignOutAlt className="w-4 h-4" />
                Logout
            </button>
        </form>
    );
};

export default Logout;
