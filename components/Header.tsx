import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import React from "react";
import LoginDropdown from "./LoginForm";

export default function Header() {
  return (
    <header className="bg-white dark:bg-black shadow-sm dark:border-b dark:border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl dark:text-gray-100">Next JS Starter Template</span>
        </div>
        <nav className="flex items-center">
          <ul className="flex space-x-2 mr-2">
            
            <li>
              <LoginDropdown />
            </li>
          </ul>
          <ThemeSwitch />
        </nav>
      </div>
    </header>
  );
}
