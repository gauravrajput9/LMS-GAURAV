import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const MyLearningCourseCards = ({ course, progress }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full sm:w-[300px] md:w-[320px] bg-white dark:bg-gray-900 rounded-2xl shadow-md hover:shadow-2xl transition-shadow duration-300 p-4 transform hover:-translate-y-2 hover:scale-[1.02]">
      <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={course.courseImage || "https://via.placeholder.com/300x200"}
          alt={course.courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="mt-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
          {course.courseTitle}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
          {course.creator?.name || "Instructor Name"}
        </p>
      </div>

      {progress && (
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {progress.progress}% completed ({progress.completedLectures}/{progress.totalLectures})
          </p>
        </div>
      )}

      <Button
        className="mt-4 w-full"
        onClick={() => navigate(`/courseProgress/${course._id}`)}
      >
        Continue
      </Button>
    </div>
  );
};

export default MyLearningCourseCards;
