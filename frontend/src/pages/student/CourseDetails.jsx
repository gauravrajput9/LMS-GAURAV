import { createCheckoutSession } from "@/api/coursePurchaseApi";
import { useMutation } from "@tanstack/react-query";
import { BadgeInfo, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CourseDetails = ({ course, purchased, id }) => {
  const { lectures = [], creator = {} } = course || {};
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const navigate = useNavigate();

  const checkoutMutation = useMutation({
    mutationFn: ({ id }) => createCheckoutSession({ id }),
    onSuccess: (data) => {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error(data?.message || "Invalid Session");
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error(error?.message || "Cannot create Session");
    },
  });

  const { isPending } = checkoutMutation;

  const handlePaymentCheckout = () => {
    checkoutMutation.mutate({ id });
  };

  return (
    <div className="bg-neutral-100 dark:bg-zinc-900 min-h-screen flex justify-center px-4 sm:px-6 md:px-12 lg:px-20 py-10">
      <div className="w-full max-w-screen-xl space-y-10">
        {/* Header */}
        <div className="bg-gray-900 text-white p-6 sm:p-8 rounded-lg shadow-md space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold">
            {course.courseTitle}
          </h1>
          <h2 className="text-lg sm:text-xl text-gray-300">
            {course.subtitle}
          </h2>
          <p className="text-base sm:text-lg">
            Created by{" "}
            <span className="font-semibold text-indigo-300">
              {creator.name}
            </span>
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1 flex-wrap">
            <BadgeInfo size={16} className="text-indigo-400 mr-1" />
            Last Updated:{" "}
            <span className="text-white font-medium">
              {new Date(course.updatedAt).toLocaleString()}
            </span>
          </p>
          <p className="text-sm text-gray-400">
            Students Enrolled: {course.enrolledStudents?.length || 0}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10">
          {/* Description + Lectures */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-slate-100 dark:bg-zinc-800 p-5 sm:p-6 rounded-lg shadow-sm border border-slate-200 dark:border-zinc-700">
              <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white mb-2">
                {course.description}
              </h3>
            </div>

            {/* Lectures List */}
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm border-l-4 border-indigo-400">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">
                Course Content
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Lectures: {lectures.length}
              </p>

              {lectures.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {lectures.map((lecture, index) => (
                    <div
                      key={lecture._id}
                      className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-gray-50 transition"
                    >
                      <span
                        onClick={() => {
                          if (lecture.isFree || purchased) {
                            setSelectedVideoUrl(lecture.videoUrl);
                          } else {
                            toast.error(
                              "This lecture is locked. Please purchase the course."
                            );
                          }
                        }}
                        className="text-gray-800 font-medium flex items-center gap-2 cursor-pointer"
                      >
                        {lecture.isFree || purchased ? (
                          <Unlock size={16} className="text-green-500" />
                        ) : (
                          <Lock size={16} className="text-red-500" />
                        )}
                        {index + 1}. {lecture.lectureTitle}
                      </span>

                      <span className="text-sm text-gray-500">
                        {lecture.duration || 0} sec
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No lectures available yet.
                </p>
              )}
            </div>
          </div>

          {/* Right Video + CTA */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-5 sm:p-6 h-full flex flex-col justify-between text-white space-y-4">
              <div className="w-full aspect-video bg-black rounded overflow-hidden">
                <video
                  key={selectedVideoUrl}
                  controls
                  className="w-full h-full object-cover"
                  src={selectedVideoUrl}
                />
              </div>

              <div>
                <h1 className="text-lg sm:text-xl font-semibold mb-2">
                  Watch Preview
                </h1>
                <p className="text-sm sm:text-base text-indigo-100 mb-4">
                  Dive into the course before enrolling.
                </p>
                <button
                  onClick={() => {
                    if (purchased) {
                      navigate(`/courseProgress/${id}`);
                    } else {
                      handlePaymentCheckout();
                    }
                  }}
                  className={`w-full font-medium py-2 rounded transition ${
                    purchased
                      ? "bg-green-600 text-white "
                      : "bg-white text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  {purchased
                    ? "Continue Progress"
                    : isPending
                      ? "Processing..."
                      : "Buy Now"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
