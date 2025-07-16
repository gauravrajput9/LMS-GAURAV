import React from "react";
import { Link } from "react-router-dom";

const ProfileCourseCard = ({ course }) => {
  if (!course) return null;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-transform duration-300 border border-gray-200 dark:border-gray-800">
      <Link to={`/course-details/${course._id}`} className="block">
        <img
          src={course.courseImage || "/default-course-image.jpg"}
          alt={course.courseTitle}
          className="w-full h-48 object-cover rounded-t-2xl"
        />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
            {course.courseTitle}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 italic">
            {course.category}
          </p>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            By: <span className="font-semibold">{course.creator?.name || "Unknown"}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProfileCourseCard;