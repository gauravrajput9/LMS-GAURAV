import { Button } from "@/components/ui/button";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "@/api/courseApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CourseTable = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const courses = data?.courses || [];

  if (isError) toast.error(error.message);

  return (
    <div className="ml-8 mt-6">
      <div className="flex justify-between items-center mb-4 w-[90%]">
        <h2 className="text-xl font-bold text-gray-800">Manage Courses</h2>
        <Button
          onClick={() => navigate("create-course")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6"
        >
          + Add New Course
        </Button>
      </div>

      <Table className="w-[90%] border border-gray-300 rounded-xl shadow-sm">
        <TableCaption className="text-gray-500">Courses List</TableCaption>

        <TableHeader className="bg-gray-100 sticky top-0 z-10">
          <TableRow>
            <TableHead className="w-[300px] text-gray-700">Title</TableHead>
            <TableHead className="text-gray-700">Price</TableHead>
            <TableHead className="text-gray-700">Status</TableHead>
            <TableHead className="text-gray-700 text-center">Edit</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <CourseTableSkeleton />
          ) : courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500">
                No courses found.
              </TableCell>
            </TableRow>
          ) : (
            courses.map((course) => (
              <TableRow
                key={course._id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <TableCell className="font-semibold text-gray-800">
                  {course.courseTitle}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  ${course?.coursePrice || "NA"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {course.isPublished ? (
                      "Published"
                    ) : (
                      <>
                        <p className="text-sm">Unpublished</p>
                      </>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-400 text-blue-600 hover:text-blue-800"
                    onClick={() =>
                      navigate(`${course._id}`, {
                        state: { course }, // ✅ optional optimization
                      })
                    }
                  >
                    <Edit2 className="w-4 h-4 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

const CourseTableSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-48" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-20 mx-auto" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default CourseTable;
