import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const SearchCourseCards = ({ course }) => {
  const navigate = useNavigate();

  const {
    _id,
    courseImage,
    courseTitle,
    coursePrice,
    creator,
    courseLevel,
  } = course;

  return (
    <div
      onClick={() => navigate(`/course-details/${_id}`)}
      className="cursor-pointer w-full max-w-[16rem] sm:max-w-[17rem] bg-white dark:bg-zinc-800 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-4 flex flex-col gap-3 border border-slate-200 dark:border-zinc-700 hover:-translate-y-1 hover:scale-[1.03]"
    >
      <div className="h-32 w-full overflow-hidden rounded-lg">
        <img
          src={courseImage || "https://via.placeholder.com/150"}
          alt={courseTitle}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h2 className="text-base sm:text-lg font-semibold line-clamp-2 hover:underline text-gray-900 dark:text-gray-100">
        {courseTitle}
      </h2>

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src={creator?.photoUrl || ""} />
            <AvatarFallback>{creator?.name?.charAt(0) || "U"}</AvatarFallback>
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

export default SearchCourseCards;
