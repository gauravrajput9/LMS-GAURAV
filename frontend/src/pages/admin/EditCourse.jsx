import { editCourses, fetchSingleCourse, publishCourse } from "@/api/courseApi";
import { CategoryDropDown } from "@/components/CategoryDropDown";
import CourseLevel from "@/components/CourseLevel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const EditCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseImage, setCourseImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isPublished, setPublished] = useState(false);

  const [courseData, setCourseData] = useState({
    courseTitle: "",
    subtitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["course", id],
    queryFn: () => fetchSingleCourse(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (data?.course) {
      const fetched = data.course;
      setCourseData({
        courseTitle: fetched.courseTitle || "",
        subtitle: fetched.subtitle || "",
        description: fetched.description || "",
        category: fetched.category || "",
        courseLevel: fetched.courseLevel || "",
        coursePrice: fetched.coursePrice || "",
      });
      setImagePreview(fetched.courseImage || "");
    }
  }, [data]);

  const editCourseMutation = useMutation({
    mutationFn: ({ formData, id }) => editCourses(formData, id),
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/admin/courses");
    },
    onError: (err) => toast.error(err.message),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = () => {
    if (!courseData.courseTitle.trim())
      return toast.error("Course title required");
    if (courseData.description.trim().length < 30)
      return toast.error("Description must be at least 30 characters");
    if (!courseData.category) return toast.error("Category is required");
    if (!courseData.courseLevel) return toast.error("Course level is required");
    if (!courseData.coursePrice || isNaN(courseData.coursePrice))
      return toast.error("Valid course price is required");
    if (!courseImage) return toast.error("Course image is required");

    const formData = new FormData();
    formData.append("courseData", JSON.stringify(courseData));
    if (courseImage) formData.append("courseImage", courseImage);

    editCourseMutation.mutate({ formData, id });
  };

  const publishCourseMutation = useMutation({
    mutationFn: ({ id, isPublished }) => publishCourse({ id, isPublished }),
    onSuccess: (data) => {
  
      refetch();
      toast.success(data?.message);
      navigate("/admin/courses");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handlePublishCourse = () => {
    if (data?.course?.lectures.length === 0) {
      return toast.error("Cannot publish course with no lectures");
    }

    publishCourseMutation.mutate({ id, isPublished: true });
  };
  const handleUnPublishCourse = () => {
    publishCourseMutation.mutate({ id, isPublished: false });
  };
  const { isPending: coursePublishStatus } = publishCourseMutation;

  if (isLoading || !data?.course) return <h1>Fetching Course Data....</h1>;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Edit Course Details</h1>
        <Button onClick={() => navigate(`/admin/courses/${id}/lecture`)}>
          Go To Lectures Page
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow border p-6 space-y-6 dark:bg-slate-900 dark:text-gray-100">
        <div>
          <h2 className="text-xl font-semibold mb-1">
            Basic Course Information
          </h2>
          <p className="text-sm text-gray-500 mb-4 dark:text-gray-400">
            Fill in the details below to update your course.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-4">
              {data?.course?.isPublished ? (
                <button
                  onClick={handleUnPublishCourse}
                  disabled={
                    coursePublishStatus || data?.course?.lectures.length === 0
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-sm transition duration-200
        ${coursePublishStatus ? "bg-yellow-400 cursor-not-allowed opacity-70" : "bg-yellow-600 hover:bg-yellow-700 text-white"}
      `}
                >
                  {coursePublishStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Unpublishing...
                    </>
                  ) : (
                    "Unpublish"
                  )}
                </button>
              ) : (
                <button
                  onClick={handlePublishCourse}
                  disabled={coursePublishStatus}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-sm transition duration-200
        ${coursePublishStatus ? "bg-green-400 cursor-not-allowed opacity-70" : "bg-green-600 hover:bg-green-700 text-white"}
      
        `}
                >
                  {coursePublishStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    "Publish"
                  )}
                </button>
              )}
            </div>

            <Button
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remove Course
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            placeholder="Enter course title"
            name="courseTitle"
            value={courseData.courseTitle}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Subtitle</Label>
          <Input
            placeholder="Enter course subtitle"
            name="subtitle"
            value={courseData.subtitle}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <textarea
            rows={4}
            name="description"
            value={courseData.description}
            onChange={handleInputChange}
            placeholder="Enter detailed description"
            className="w-full border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Category</Label>
            <CategoryDropDown
              value={courseData.category}
              onChange={(val) =>
                setCourseData((prev) => ({ ...prev, category: val }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Course Level</Label>
            <CourseLevel
              value={courseData.courseLevel}
              onChange={(val) =>
                setCourseData((prev) => ({ ...prev, courseLevel: val }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <Input
              type="number"
              name="coursePrice"
              placeholder="Enter price"
              value={courseData.coursePrice}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Course Image</Label>
          {imagePreview && (
            <img
              src={
                typeof imagePreview === "string"
                  ? imagePreview
                  : URL.createObjectURL(imagePreview)
              }
              alt="Preview"
              className="w-48 h-auto rounded-md mb-3 border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCourseImage(file);
                setImagePreview(file);
              }
            }}
            className="mt-2 block w-full text-sm text-gray-700 dark:text-gray-100
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:bg-black file:text-white
              file:cursor-pointer"
          />
        </div>

        <div className="flex flex-col md:flex-row justify-end gap-3 pt-6 border-t mt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            onClick={handleFormSubmit}
            disabled={editCourseMutation.isLoading}
          >
            {editCourseMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin w-4 h-4" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
