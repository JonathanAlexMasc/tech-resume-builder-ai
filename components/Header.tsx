import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import React from "react";
import LoginDropdown from "./LoginForm";
import { auth } from "@/auth";
import Logout from "./Logout";
import Avatar from "./Avatar";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-white dark:bg-black shadow-sm dark:border-b dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href='/'>
          <div className="flex items-center">
            <span className="text-xl dark:text-gray-100">Tech Resume Builder AI</span>
          </div>
        </Link>

        <nav className="flex items-center">
          <ul className="flex space-x-2 mr-2">
            {!session ? <li>
              <LoginDropdown />
            </li> : 
              <li>
                <Avatar />
              </li>
            }
            
          </ul>
          {/* <ThemeSwitch /> */}
        </nav>
      </div>
    </header>
  );
}
