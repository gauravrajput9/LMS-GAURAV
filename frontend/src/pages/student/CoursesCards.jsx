import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const CoursesCards = (courses) => {

  const { courseImage, coursePrice, courseTitle, creator, courseLevel } =
    courses.course;
  const id = courses?.course?._id;

  return (
    <div className="w-full max-w-[16rem] sm:max-w-[17rem] bg-white/90 backdrop-blur rounded-lg shadow-md hover:shadow-lg p-3 flex flex-col gap-2.5 relative overflow-hidden transform-gpu transition-all duration-300 hover:-translate-y-1 subtle-3d-card">
      <div className="h-32 w-full overflow-hidden rounded-md">
        <img
          src={courseImage || "https://via.placeholder.com/150"}
          alt={courseTitle || "Course Image"}
          className="h-full w-full object-cover object-center"
        />
      </div>
      <Link
        to={`course-details/${id}`}
        className="no-underline text-gray-800 hover:text-gray-900"
      >
        <h1 className="text-base sm:text-lg font-semibold line-clamp-2 hover:underline">
          {courseTitle}
        </h1>
      </Link>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7">
            <AvatarImage src="https://avatars.githubusercontent.com/u/10911035" />
            <AvatarFallback>GR</AvatarFallback>
          </Avatar>
          <p className="text-xs font-medium text-gray-800">{creator?.name}</p>
        </div>

        <Badge className="bg-blue-600 text-white px-2 py-0.5 text-[10px] rounded">
          {courseLevel || "Beginner"}
        </Badge>
      </div>

      <div>
        <p className="font-bold text-base ml-2">Price: ₹{coursePrice || 0}</p>
      </div>
    </div>
  );
};

export default CoursesCards;
