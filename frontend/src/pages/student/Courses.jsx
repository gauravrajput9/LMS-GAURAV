import { Skeleton } from "@/components/ui/skeleton";
import CoursesCards from "./CoursesCards";
import { useQuery } from "@tanstack/react-query";
import { getPublishedCourses } from "@/api/courseApi";
import { useEffect, useState } from "react";

const Courses = () => {
  const [publishedCourses, setPublishedCourses] = useState([]);

  const { data, isSuccess, isLoading } = useQuery({
    queryFn: getPublishedCourses,
    queryKey: ["publishedCourses"],
    refetchOnWindowFocus: false,
  });
  useEffect(() => {
    if (isSuccess) {
      setPublishedCourses(data?.courses || {});
    }
  }, [isSuccess, data?.courses]);

  // console.log(publishedCourses);
  return (
    <div className="p-6">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <CoursesSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {publishedCourses.map((course) => (
            <CoursesCards key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export const CoursesSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 p-4 rounded-xl bg-zinc-800 shadow-md">
      <Skeleton className="h-26 w-full rounded-md bg-zinc-700" />
      <Skeleton className="h-4 w-3/4 bg-zinc-700" />
      <Skeleton className="h-4 w-1/2 bg-zinc-700" />
      <Skeleton className="h-4 w-2/3 bg-zinc-700" />
      <Skeleton className="h-8 w-24 rounded bg-zinc-700" />
    </div>
  );
};

export default Courses;
