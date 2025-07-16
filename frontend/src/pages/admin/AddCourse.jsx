import { createCourse } from "@/api/courseApi";
import { CategoryDropDown } from "@/components/CategoryDropDown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const navigate = useNavigate();

  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");
  const [courseImage, setCourseImage] = useState("");

  const createCourseMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: (data) => {

      toast.success(data?.message || "Course Created Successfully");
      setCourseTitle("")
      setCategory("")
      setCourseImage("")
      navigate("/admin/courses")
    },
    onError: (error) => {
      console.log(error);
      if (error?.response?.status === 401) {
        toast.error("Not Authenticated");
      } else {
        toast.error(error?.response?.data?.message || "Something went wrong");
      }
    },
  });
  const isLoading = createCourseMutation.isPending;

  const createCoursehandler = (e) => {
    e.preventDefault();
    if (!courseTitle.trim() || !category.trim() || !courseImage) {
      toast.error("Please fill out all fields");
      return;
    }
    const formData = new FormData();
    formData.append("courseTitle", courseTitle);
    formData.append("category", category);
    formData.append("courseImage", courseImage);
    createCourseMutation.mutate(formData);
  };

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl mb-2">
        Let's Add a Course — Enter the Basic Details
      </h1>
      <p className="text-gray-600 mb-6">
        Provide a title, choose a category and add a Image to get started.
      </p>

      <form onSubmit={createCoursehandler} className="space-y-6">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="courseTitle">Title</Label>
          <Input
            id="courseTitle"
            type="text"
            placeholder="Enter a title for your course..."
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="category">Category</Label>
          <CategoryDropDown value={category} onChange={setCategory} />
        </div>

        <div className="flex flex-col space-y-2">
          <Label htmlFor="courseImage">Course Image</Label>
          <Input
            id="courseImage"
            type="file"
            onChange={(e) => setCourseImage(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <div className="flex gap-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Please Wait...
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
