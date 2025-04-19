import Link from "next/link";
import React from "react";

export default function Hero() {
  return (
    <section className="text-center my-32 mx-4 sm:mx-8 md:mx-16 lg:mx-24">
      <h1 className="font-sans text-3xl tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl dark:text-white mb-6">
        Build a High Quality Tech Resume — Fast, for Free.
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 font-light">
        An AI-powered resume builder designed by big tech engineers. Create clean, LaTeX-based resumes optimized for developer roles and ATS systems — in minutes.
      </p>
      <div className="flex justify-center space-x-6">
        <Link
          href="/resume"
          className="bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-md text-base font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
