import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import p1 from "../../images/p1.jpg";
import p2 from "../../images/p2.jpg";
import p3 from "../../images/p3.jpg";
import p4 from "../../images/p4.jpg";
import AllPropertiesCards from "../user/AllPropertiesCards";

const images = [p1, p2, p3, p4];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation(); // Deteksi URL halaman aktif saat ini

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-800 font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[#7f5539]/10 shadow-sm py-4 px-8 flex justify-between items-center transition-all duration-300">
        <Link to="/" className="text-2xl font-extrabold text-[#7f5539] tracking-tight flex items-center gap-2">
          <span className="bg-[#7f5539] text-white w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg shadow-md shadow-[#7f5539]/20">R</span>
          <span>Rent<span className="text-[#7f5539]">Ease</span></span>
        </Link>
        <div className="space-x-6 text-sm font-medium flex items-center">
          {/* Menu Home (Cokelat jika aktif di "/") */}
          <Link
            to="/"
            className={`transition-colors ${
              location.pathname === "/"
                ? "text-[#7f5539] font-bold border-b-2 border-[#7f5539] pb-0.5"
                : "text-stone-600 hover:text-[#7f5539]"
            }`}
          >
            Home
          </Link>

          {/* Menu Login (Cokelat jika aktif di "/login") */}
          <Link
            to="/login"
            className={`transition-colors ${
              location.pathname === "/login"
                ? "text-[#7f5539] font-bold border-b-2 border-[#7f5539] pb-0.5"
                : "text-stone-600 hover:text-[#7f5539]"
            }`}
          >
            Login
          </Link>

          {/* Tombol Register */}
          <Link
            to="/register"
            className={`px-5 py-2.5 rounded-xl shadow-md shadow-[#7f5539]/20 transition-all transform active:scale-95 text-white ${
              location.pathname === "/register"
                ? "bg-[#65432d] ring-2 ring-[#7f5539] ring-offset-2"
                : "bg-[#7f5539] hover:bg-[#65432d]"
            }`}
          >
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative w-full h-[75vh] mt-16 overflow-hidden">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
              currentIndex === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
            } transform transition-transform`}
          >
            <img src={img} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/30 to-transparent"></div>
          </div>
        ))}

        {/* Center Text */}
        <div className="absolute bottom-24 w-full text-center text-white px-6 max-w-4xl left-1/2 transform -translate-x-1/2">
          <span className="inline-block px-4 py-1.5 bg-[#faedcd]/20 border border-[#faedcd]/40 backdrop-blur-md text-[#faedcd] text-xs font-semibold uppercase tracking-wider rounded-full mb-4">
            Premium Housing Solutions
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-md mb-4 leading-tight">
            Find Your Dream Rental Property
          </h1>
          <p className="text-base md:text-xl font-light text-stone-200 max-w-2xl mx-auto drop-shadow">
            Comfort, Convenience & Class — All in One Place
          </p>
        </div>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2.5 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? "bg-[#faedcd] w-8 shadow-lg"
                  : "bg-white/50 w-2.5 hover:bg-white/80"
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Properties Section */}
      <div className="max-w-7xl mx-auto w-full py-20 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#7f5539]">Explore Listings</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-stone-800 mt-1">
              Featured Rental Properties
            </h2>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-stone-500 text-sm">Want to list your place?</span>
            <Link
              to="/register"
              className="px-4 py-2 border border-[#7f5539] text-[#7f5539] font-medium text-sm rounded-xl hover:bg-[#faedcd]/50 transition-colors"
            >
              Register as Owner
            </Link>
          </div>
        </div>

        {/* Property Cards */}
        <div>
          <AllPropertiesCards />
        </div>
      </div>
    </div>
  );
};

export default Home;