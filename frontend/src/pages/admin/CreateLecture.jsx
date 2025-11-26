import { createLecture, getCoursesLecture } from "@/api/courseApi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const lecturesQuery = useQuery({
    queryKey: ["courseLectures", id],
    queryFn: () => getCoursesLecture(id),
    staleTime: 1000 * 60 * 5,
  });

  const { data: lectures } = lecturesQuery;
  const finalLectures = lectures?.lectures || [];

  const createLectureMutation = useMutation({
    mutationFn: ({ lectureTitle, id }) => createLecture({ lectureTitle, id }),
    onSuccess: () => {
      toast.success("Lecture Created Successfully");
      queryClient.invalidateQueries(["courseLectures", id]);
      queryClient.invalidateQueries(["course", id]);
      setLectureTitle("");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to create Lecture");
    },
  });

  const lectureCreateHandler = () => {
    if (!lectureTitle.trim()) return toast.error("Please enter a title");
    createLectureMutation.mutate({ lectureTitle, id });
  };

  return (
    <div className="min-h-screen dark:bg-slate-900 dark:text-gray-100 p-8">
      <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-6 mb-8">
        <h1 className="text-2xl font-bold mb-2 dark:text-white">
          Let's Add Lectures For Your Course...
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Add and manage the lectures below.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <label className="block text-sm font-medium dark:text-slate-300">
          Title
        </label>
        <input
          type="text"
          className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-gray-400 focus:ring-2 focus:ring-slate-500 dark:focus:ring-slate-700"
          placeholder="Enter a title for your lecture"
          name="lectureTitle"
          value={lectureTitle}
          onChange={(e) => setLectureTitle(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mb-10">
        <button
          onClick={() => navigate(`/admin/courses/${id}`)}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
        >
          Back to Course
        </button>
        <button
          onClick={lectureCreateHandler}
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center gap-2"
        >
          {createLectureMutation.isPending ? (
            <>
              <Loader2 className="animate-spin w-5 h-5 mr-2 text-white" />
              Creating
            </>
          ) : (
            "Create Lecture"
          )}
        </button>
      </div>

      <div className="font-semibold text-xl text-gray-600 font-serif">
        Total Lectures: <span className="text-2xl">{finalLectures.length}</span>
        <p className="mt-2 font-sans font-bold text-2xl text-black">
          {finalLectures.length === 0 ? "No lectures available" : ""}
        </p>
      </div>

      {/* ✅ Display list of lectures */}
      <ul className="space-y-4 mt-6">
        {finalLectures.map((lecture) => (
          <li
            key={lecture._id}
            className="flex justify-between items-center p-4 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700"
          >
            <div>
              <h1 className="text-lg font-semibold text-black dark:text-white">
                {lecture.lectureTitle}
              </h1>
            </div>
            <button
              onClick={() => {
                const lectureId = lecture._id;
                navigate(`/admin/courses/${id}/lecture/${lectureId}`);
              }}
              className="px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateLecture;
