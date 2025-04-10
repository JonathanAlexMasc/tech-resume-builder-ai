import React from "react";
import Review from "./Review";

interface ReviewData {
  rating: number;
  title: string;
  content: string;
  author: string;
  designation: string;
}

interface ReviewsProps {
  reviews?: ReviewData[];
}

const defaultReviews: ReviewData[] = [
  {
    rating: 5,
    title: "Landed my first FAANG interview",
    content:
      "The bullet point suggestions were insanely good. I used this resume for my Meta application and actually got a callback. Huge win.",
    author: "Priya Menon",
    designation: "Software Engineer @ Startup",
  },
  {
    rating: 5,
    title: "Exactly what every dev needs",
    content:
      "I’ve tried Canva and Notion templates, but nothing came close to this. The LaTeX export looks so clean and professional — plus it’s ATS-friendly.",
    author: "Kevin Huang",
    designation: "CS Student @ UC Berkeley",
  },
  {
    rating: 5,
    title: "AI-powered and it shows",
    content:
      "I just typed in my role and experience, and it generated resume bullets that actually made me sound legit. The fact that this was built by FAANG engineers shows.",
    author: "Sarah Johnson",
    designation: "Frontend Dev @ Fintech Co",
  },
  {
    rating: 4,
    title: "Great tool for busy devs",
    content:
      "It saved me hours of formatting. The versioning feature is super useful, and I love how fast the export is. I wish there were more design themes though.",
    author: "Jared Patel",
    designation: "Backend Developer",
  },
];

const Reviews: React.FC<ReviewsProps> = ({ reviews = defaultReviews }) => {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl text-center mb-8 text-gray-900 dark:text-white">
          A beautiful reviews section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          {reviews.map((review, index) => (
            <Review key={index} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
