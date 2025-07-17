import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const CoursesCards = (courses) => {

  const { courseImage, coursePrice, courseTitle, creator, courseLevel } =
    courses.course;
  const id = courses?.course?._id;

  return (
    <div className="w-full max-w-[16rem] sm:max-w-[17rem] bg-white/90 dark:bg-zinc-800 backdrop-blur rounded-2xl shadow-lg hover:shadow-2xl p-4 flex flex-col gap-3 relative overflow-hidden transform-gpu transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] border border-slate-200 dark:border-zinc-700">
      <div className="h-32 w-full overflow-hidden rounded-lg">
        <img
          src={courseImage || "https://via.placeholder.com/150"}
          alt={courseTitle || "Course Image"}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <Link
        to={`course-details/${id}`}
        className="no-underline text-gray-800 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
      >
        <h1 className="text-base sm:text-lg font-semibold line-clamp-2 hover:underline">
          {courseTitle}
        </h1>
      </Link>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src="https://avatars.githubusercontent.com/u/10911035" />
            <AvatarFallback>GR</AvatarFallback>
          </Avatar>
          <p className="text-xs font-medium text-gray-800 dark:text-gray-200">{creator?.name}</p>
        </div>

        <Badge className="bg-blue-600 text-white px-2 py-0.5 text-[10px] rounded-full shadow-sm">
          {courseLevel || "Beginner"}
        </Badge>
      </div>

      <div className="flex justify-end">
        <p className="font-bold text-base text-indigo-700 dark:text-indigo-300">₹{coursePrice || 0}</p>
      </div>
    </div>
  );
};

export default CoursesCards;
