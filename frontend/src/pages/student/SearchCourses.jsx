import React, { useEffect, useState } from "react";
import { CoursesSkeleton } from "./Courses";
import Filter from "./Filter";
import { useQuery } from "@tanstack/react-query";
import { getAllPublishedCourses, getSearchedCourse } from "@/api/courseApi";
import SearchCourseCards from "./SearchedCourseCard";
import { useSearchParams } from "react-router-dom";
import Fuse from "fuse.js";

const SearchCourses = () => {
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    setCategory(searchParams.getAll("category") || []);
    setSort(searchParams.get("sort") || "");
  }, [searchParams]);

  const isFiltering = !!category.length || !!sort;

  // Fetch all published courses for fuzzy search
  const {
    data: allPublishedData,
    isLoading: isAllPublishedLoading,
  } = useQuery({
    queryKey: ["allPublishedCourses"],
    queryFn: getAllPublishedCourses,
  });

  // Backend filtered courses (category, sort only)
  const {
    data: filteredData,
    isLoading: isFilteringLoading,
  } = useQuery({
    queryKey: ["filteredCourses", { category, sortBy: sort }],
    queryFn: () => getSearchedCourse({ category, sortBy: sort }),
    enabled: isFiltering,
  });

  // Fuse.js for local fuzzy search
  let displayedCourses = [];

  if (query && allPublishedData?.courses) {
    const fuse = new Fuse(allPublishedData.courses, {
      keys: ["title", "description", "category"],
      threshold: 0.3,
    });
    displayedCourses = fuse.search(query).map((res) => res.item);
  } else if (isFiltering) {
    displayedCourses = filteredData?.courses || [];
  } else {
    displayedCourses = allPublishedData?.courses || [];
  }

  const isLoading = query
    ? isAllPublishedLoading
    : isFiltering
    ? isFilteringLoading
    : isAllPublishedLoading;

  const isEmpty = !displayedCourses?.length;

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <aside className="w-full lg:w-1/4 bg-white dark:bg-gray-900 p-4 rounded-xl shadow-md mb-4 lg:mb-0">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Filters</h2>
        <Filter
          selectedCategories={category}
          onCategoryChange={setCategory}
          sortBy={sort}
          onSortChange={setSort}
        />
      </aside>

      {/* Course Results Section */}
      <main className="w-full lg:w-3/4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <CoursesSkeleton key={idx} />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-center text-gray-500 dark:text-gray-400 text-lg mt-10">
            ⚠️ No courses found for your search.
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              {query ? `Search results for "${query}"` : "Available Courses"}
            </h2>
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              {displayedCourses.map((course) => (
                <SearchCourseCards key={course._id} course={course} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default SearchCourses;