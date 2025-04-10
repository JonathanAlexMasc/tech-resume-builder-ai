import React from "react";
import FeatureCard from "./FeatureCard";
import { FaRobot, FaFilePdf, FaMagic, FaShieldAlt } from "react-icons/fa";
import { SiLatex, SiPostgresql, SiOpenai } from "react-icons/si";

const Features = () => {
  const features = [
    {
      icon: FaRobot,
      title: "AI-Powered Suggestions",
      description: "Get intelligent, role-specific bullet points written by AI trained on FAANG-level resumes.",
    },
    {
      icon: SiLatex,
      title: "Beautiful LaTeX Output",
      description: "Export your resume in a clean, professional LaTeX format optimized for ATS systems.",
    },
    {
      icon: FaMagic,
      title: "One-Click Resume Generation",
      description: "Just input your experience and skills — we’ll handle formatting, structure, and polish.",
    },
    {
      icon: SiPostgresql,
      title: "Persistent Resume Storage",
      description: "Save multiple versions of your resume securely and access them anytime.",
    },
    {
      icon: FaShieldAlt,
      title: "Secure Authentication",
      description: "Built-in user authentication ensures your data stays private and secure.",
    },
    {
      icon: SiOpenai,
      title: "Powered by OpenAI",
      description: "Leverages GPT to generate compelling content tailored to your goals and job title.",
    },
  ];

  return (
    <section className="container mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 transition-colors duration-200 rounded-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">Features</h2>
          <p className="mt-8 text-xl text-gray-600 dark:text-gray-300 font-light">
            Built by FAANG engineers to help you craft the perfect tech resume in minutes. Powered by AI. Output as LaTeX.
          </p>
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
