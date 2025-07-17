import React, { useEffect } from "react";
import { useMutation, useQueries } from "@tanstack/react-query";
import { loadUser } from "@/api/authApi";
import { getSingleCourseProgress } from "@/api/courseApi";
import MyLearningCards from "@/components/MyLearningCourseCards";
import { Skeleton } from "@/components/ui/skeleton";

const MyLearning = () => {
  const skeletonArray = [1, 2, 3];

  const loadUserMutation = useMutation({
    mutationFn: loadUser,
  });

  useEffect(() => {
    loadUserMutation.mutate();
  }, []);

  const myLearningArray = loadUserMutation.data?.user?.enrolledCourses || [];
  const isLoading = loadUserMutation.isPending;

  const progressQueries = useQueries({
    queries: myLearningArray.map((course) => ({
      queryKey: ["courseProgress", course._id],
      queryFn: () => getSingleCourseProgress(course._id),
    })),
  });

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8 py-10 bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <div className="w-full max-w-7xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          My Learning Page
        </h1>
        <p className="mt-4 text-gray-700 dark:text-gray-300 text-center">
          This is your personalized learning dashboard. Start exploring your
          courses and track your progress.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {isLoading ? (
            skeletonArray.map((_, index) => <MyLearningSkeleton key={index} />)
          ) : myLearningArray.length === 0 ? (
            <p className="p-3 font-medium text-xl text-gray-600">
              You Are Not Enrolled In Any Course..
            </p>
          ) : (
            myLearningArray.map((course, index) => {
              const progress = progressQueries[index]?.data;
              return (
                <MyLearningCards
                  key={course._id}
                  course={course}
                  progress={progress}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLearning;

const MyLearningSkeleton = () => {
  return (
    <div className="w-full sm:w-[300px] md:w-[320px] h-40 rounded-xl bg-white shadow-md p-4 flex gap-4">
      <Skeleton className="w-24 h-full rounded-lg" />
      <div className="flex flex-col flex-1 gap-2 py-1">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-4 w-full rounded" />
      </div>
    </div>
  );
};
