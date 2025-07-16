import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleFormSubmission = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/course/search-courses?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 text-white py-24 px-6">
      <div className="max-w-5xl mx-auto text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Find the <span className="text-yellow-300 drop-shadow">Best Courses</span> for You
        </h1>

        <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
          Discover, Learn, and Upskill with our wide range of high-quality courses built for every learner.
        </p>

        <p className="text-md sm:text-lg italic font-semibold text-yellow-100 underline">
          The best way to search is by typing in the search box below.
        </p>

        <form onSubmit={handleFormSubmission} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex w-full sm:w-[500px] shadow-xl bg-white rounded-full overflow-hidden transition focus-within:ring-2 focus-within:ring-blue-400">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a course..."
              className="flex-1 px-5 py-4 text-gray-800 bg-white border-none focus:outline-none placeholder-gray-500"
            />
            <button
              type="submit"
              className="px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all rounded-none rounded-r-full"
            >
              Search
            </button>
          </div>
        </form>

        <Button
          variant="secondary"
          onClick={() => navigate("/course/search-courses")}
          className="mt-6 bg-white text-blue-700 font-semibold rounded-full px-8 py-3 shadow-lg hover:bg-blue-100 transition-all duration-300"
        >
          Explore Courses
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
