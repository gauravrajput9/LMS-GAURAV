import { getPurchasedCourse } from "@/api/coursePurchaseApi";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CourseDetails from "./CourseDetails";
import { Loader2 } from "lucide-react";

const RenderCourseDetails = () => {
  const params = useParams();
  const id = params.id;

  const [courseData, setCourseData] = useState({
    course: null,
    purchased: false,
  });

  const fetchDataMutation = useMutation({
    mutationFn: (id) => getPurchasedCourse(id),
    onSuccess: (data) => {
      if (data) {
        setCourseData({
          course: data?.course,
          purchased: data?.purchased,
        });
      }
    },
    onError: (error) => {
      console.log("purchase course data error: ", error);
    },
  });

  useEffect(() => {
    if (id) {
      fetchDataMutation.mutate(id);
    }
  }, [id, fetchDataMutation.mutate]);

  const { isPending } = fetchDataMutation;

  if (isPending)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
        <p className="text-lg font-medium text-gray-600">
          Loading course details...
        </p>
      </div>
    );

  return (
    <>
      {courseData.course ? (
        <CourseDetails
          course={courseData.course}
          purchased={courseData.purchased}
          id={id}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-red-500 text-lg">Failed to load course details</p>
        </div>
      )}
    </>
  );
};

export default RenderCourseDetails;
