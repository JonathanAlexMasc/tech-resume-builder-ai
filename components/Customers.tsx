import React from "react";
import {
  AiOutlineCloud,
  AiOutlineFilePdf,
  AiOutlineBulb,
  AiOutlineUser,
  AiOutlineCode,
  AiOutlineCheckCircle,
  AiFillThunderbolt,
} from "react-icons/ai";

const icons = [
  { Icon: AiOutlineCloud },
  { Icon: AiOutlineFilePdf },
  { Icon: AiOutlineBulb },
  { Icon: AiOutlineUser },
  { Icon: AiOutlineCode },
  { Icon: AiOutlineCheckCircle },
  { Icon: AiFillThunderbolt },
];

const Customers: React.FC = () => {
  return (
    <div className="w-full py-12 bg-black dark:bg-white">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row w-full">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-6 md:mb-0 text-white dark:text-black text-center md:text-left md:w-1/3">
              Trusted by CS students and new grads building FAANG-ready resumes
            </h2>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 md:w-2/3">
              {icons.map(({ Icon }, index) => (
                <div key={index} className="flex flex-col items-center justify-center">
                  <Icon className="text-3xl md:text-4xl text-white dark:text-black" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
