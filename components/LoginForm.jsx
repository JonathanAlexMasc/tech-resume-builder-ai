import { Menu, Transition, MenuButton, MenuItems } from "@headlessui/react";
import { Fragment } from "react";
import { FaUser, FaGoogle, FaGithub } from "react-icons/fa";
import { loginAction } from "@/app/actions";

const LoginDropdown = () => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton className="inline-flex items-center gap-2 text-sm text-gray-800 dark:text-white px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <FaUser className="w-4 h-4" />
          Login
        </MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-md bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-4">
          <form action={loginAction} className="flex flex-col gap-3">
            <button
              type="submit"
              name="action"
              value="google"
              className="flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white font-medium py-2 px-4 border border-gray-300 dark:border-gray-700 rounded-md transition"
            >
              <FaGoogle className="w-4 h-4" />
              Sign in with Google
            </button>
            <button
              type="submit"
              name="action"
              value="github"
              className="flex items-center gap-3 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-md transition"
            >
              <FaGithub className="w-4 h-4" />
              Sign in with GitHub
            </button>
          </form>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default LoginDropdown;
