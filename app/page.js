import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Section from "@/components/Section";
import Footer from "@/components/Footer";
import Customers from "@/components/Customers";
import Image from "next/image";
import Accordion from "@/components/Accordion";
import Reviews from "@/components/Reviews";
import Download from "@/components/Download";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black">
      <Header />
      <main>
        <Hero />
        <Features />
        <Section
          leftHalf={
            <>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">
                Build FAANG-ready resumes in minutes
              </h2>
              <p className="text-xl font-light">
                Designed by FAANG engineers, our AI resume builder helps you craft tailored, ATS-friendly resumes with
                clean LaTeX formatting and smart content suggestions — no design skills needed.
              </p>
            </>
          }
          rightHalf={
            <Image
              src={"/products/phone.png"}
              alt="Resume builder preview"
              width={500}
              height={100}
              className="w-1/2 h-auto"
            />
          }
        />
        <Customers />
        <Section
          leftHalf={<Accordion />}
          rightHalf={
            <div className="flex flex-col justify-end">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">
                AI-Powered. ATS-Optimized. LaTeX-Perfect.
              </h2>
              <p className="text-xl font-light">
                Explore the features that make our resume builder stand out — from intelligent bullet point generation
                and sleek LaTeX output, to version tracking and secure cloud storage. All built with FAANG-level precision.
              </p>
            </div>
          }
        />
      </main>
      <Footer />
    </div>
  );
}