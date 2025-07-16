import React, { useEffect, useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCourseProgress,
  markAsCompleted,
  markAsInCompleted,
  markLectureIncomplete,
  updateLectureProgress,
} from "@/api/courseProgressApi";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const CourseProgress = () => {
  const { id } = useParams();
  const [currentLecture, setCurrentLecture] = useState(null);

  const { data, isError, error, refetch, isLoading } = useQuery({
    queryFn: () => getCourseProgress(id),
    queryKey: ["courseProgress", id],
  });

  const courseDetails = data?.data?.courseDetails;
  const progress = data?.data?.progress;
  const completed = data?.data?.completed;

  useEffect(() => {
    if (!currentLecture && courseDetails?.lectures?.length > 0) {
      setCurrentLecture(courseDetails.lectures[0]);
    }
  }, [courseDetails]);

  const updateLectureProgressMutation = useMutation({
    mutationFn: ({ id, lectureId }) => updateLectureProgress({ id, lectureId }),
    onSuccess: () => refetch(),
    onError: (error) => {
      console.error("Lecture update failed:", error);
      toast.error("Failed to mark lecture as completed");
    },
  });

  const markCourseAsCompletedMutation = useMutation({
    mutationFn: (id) => markAsCompleted(id),
    onSuccess: () => {
      toast.success("Course marked as completed");
      refetch();
    },
    onError: (error) => {
      console.error("Course completion failed:", error);
      toast.error("Failed to mark course as completed");
    },
  });

  const handleLectureIncompleteMutation = useMutation({
    mutationFn: ({ lectureId, id }) => markLectureIncomplete({ lectureId, id }),
    onSuccess: () => {
      toast.success("Lecture marked as incomplete");
      refetch();
    },
    onError: (error) => {
      console.error("Failed to mark lecture as incomplete:", error);
      toast.error("Error updating lecture status");
    },
  });

  const courseIncompleteMutation = useMutation({
    mutationFn: (id) => markAsInCompleted(id),
    onSuccess: () => {
      toast.success("Marked Course As Incomplete");
      refetch();
    },
    onError: (error) => [console.log(error)],
  });

  const handleMarkCourseAsCompleted = () => {
    markCourseAsCompletedMutation.mutate(id);
  };

  const handleMarkCourseAsIncomplete = () => {
    alert("All Your Progress For This Course Will Be Lost");
    courseIncompleteMutation.mutate(id);
  };

  const handleLectureCompletion = (lectureId) => {
    updateLectureProgressMutation.mutate({ id, lectureId });
  };

  const handleLectureIncomplete = (lectureId) => {
    handleLectureIncompleteMutation.mutate({ lectureId, id });
  };

  const handleCurrentLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  const isLectureCompleted = (lectureId) => {
    return progress.some(
      (item) => item.lectureId === lectureId && item.viewed === true
    );
  };

  if (isLoading) {
    return <div className="text-center py-10 text-gray-400">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-400">
        Error: {error.message || "Something went wrong!"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 p-6 flex flex-col text-gray-200">
      {/* Course Title */}
      <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
        {courseDetails && courseDetails.courseTitle}
      </h1>

      <button
        onClick={() => {
          if (completed) {
            handleMarkCourseAsIncomplete();
          } else handleMarkCourseAsCompleted();
        }}
        disabled={markCourseAsCompletedMutation.isLoading}
        className={`bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 mb-6 block mx-auto `}
      >
        {markCourseAsCompletedMutation.isLoading ? (
          "Marking..."
        ) : completed ? (
          <div className="flex gap-2 items-center justify-center">
            {" "}
            <CheckCircle className="h-4 w-4" /> Completed(Mark As Incomplete)
          </div>
        ) : (
          <div className="flex gap-2 items-center justify-center">
            {" "}
            <Circle className="h-4 w-4" /> Mark Course As Completed
          </div>
        )}
      </button>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Lecture List */}
        <aside className="w-1/3 bg-zinc-800 rounded-2xl shadow-lg p-5 overflow-y-auto max-h-[80vh] border border-zinc-700">
          <h2 className="text-xl font-semibold text-white mb-4">Lectures</h2>
          <ul className="space-y-3">
            {courseDetails?.lectures.map((lecture) => {
              const isActive = currentLecture?._id === lecture._id;
              const isCompleted = isLectureCompleted(lecture._id);

              return (
                <li
                  key={lecture._id}
                  onClick={() => handleCurrentLecture(lecture)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border flex flex-col gap-2 shadow-sm
                    ${
                      isActive
                        ? "bg-zinc-700 border-purple-500"
                        : "bg-zinc-900 border-zinc-700 hover:bg-zinc-800"
                    }
                  `}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      {isCompleted ? (
                        <CheckCircle className="text-green-400 w-5 h-5" />
                      ) : (
                        <Circle className="text-gray-500 w-5 h-5" />
                      )}
                      <p className="font-medium text-sm text-white">
                        {lecture.lectureTitle}
                      </p>
                    </div>
                    <span className="text-xs text-purple-400 font-medium">
                      {isCompleted ? "Completed" : "Mark as Completed"}
                    </span>
                  </div>
                  {isCompleted && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLectureIncomplete(lecture._id);
                      }}
                      disabled={handleLectureIncompleteMutation.isLoading}
                      className="text-red-400 hover:text-red-500 text-xs underline self-end transition"
                    >
                      {handleLectureIncompleteMutation.isLoading
                        ? "Marking..."
                        : "Mark as Incomplete"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Video Player */}
        <section className="flex-1 bg-zinc-800 rounded-2xl shadow-lg p-6 border border-zinc-700">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {currentLecture?.lectureTitle}
          </h2>
          <div className="aspect-video w-full bg-black rounded-xl overflow-hidden border-4 border-purple-500 shadow-inner">
            <video
              controls
              className="w-full h-full object-cover"
              src={currentLecture?.videoUrl}
              poster="https://via.placeholder.com/1280x720?text=Lecture+Video"
              onPlay={() => handleLectureCompletion(currentLecture?._id)}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CourseProgress;
