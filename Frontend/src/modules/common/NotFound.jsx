import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col justify-center items-center px-4 font-sans text-center">
      <div className="w-20 h-20 bg-[#faedcd] text-[#7f5539] flex items-center justify-center rounded-3xl text-4xl font-bold mb-4 shadow-inner border border-[#7f5539]/20">
        404
      </div>
      <h1 className="text-3xl font-extrabold text-stone-800 tracking-tight mb-2">
        Page Not Found
      </h1>
      <p className="text-stone-500 text-sm max-w-md mb-6">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-[#7f5539] text-white font-semibold px-6 py-2.5 rounded-xl shadow-md shadow-[#7f5539]/20 hover:bg-[#65432d] transition text-sm"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;