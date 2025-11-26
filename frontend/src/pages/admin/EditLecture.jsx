import { delLecture, editLecture, getEditingLecture } from "@/api/courseApi";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export const EditLecture = () => {
  const { id, lectureId } = useParams();
  const navigate = useNavigate();
  const queryClient =  useQueryClient();

  const [lectureTitle, setLectureTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [isVideoFree, setVideoFree] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // ✅ required for progress bar

  const updatesLecturesMutation = useMutation({
    mutationFn: ({ id, lectureId, formData, onUploadProgress }) =>
      editLecture({ id, lectureId, formData, onUploadProgress }),
    onSuccess: (data) => {

      navigate(`/admin/courses/${id}/lecture`);
      queryClient.invalidateQueries(["courseLectures", id]);
      queryClient.invalidateQueries(["course", id]);
      toast.success("Lecture Updated Successfully");
      setLectureTitle("");
      setDescription("");
      setVideoFile(null);
      setUploadProgress(0);
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.response?.data || "Failed to update lecture");
      setUploadProgress(0);
    },
  });

  const handleUpdateLecture = () => {
    const formData = new FormData();
    formData.append("lectureTitle", lectureTitle);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("isVideoFree", isVideoFree);

    updatesLecturesMutation.mutate({
      id,
      lectureId,
      formData,
      onUploadProgress: (e) => {
        const percent = Math.round((e.loaded * 100) / e.total);
        setUploadProgress(percent);
      },
    });
  };

  const { data } = useQuery({
    queryKey: ["lectureData", id, lectureId],
    queryFn: () => getEditingLecture({ id, lectureId }),
  });

  useEffect(() => {
    if (data?.lecture) {
      setDescription(data.lecture.description || "");
      setLectureTitle(data.lecture.lectureTitle || "");
      setVideoFree(data.lecture.isFree || false);
    }
  }, [data]);

  const deleteLectureMutation = useMutation({
    mutationFn: () => delLecture({ id, lectureId }),
    onSuccess: (data) => {
   
      queryClient.invalidateQueries(["courseLectures", id]);
      queryClient.invalidateQueries(["course", id]);
      toast.success("Lecture Deleted Successfully");
      navigate(`/admin/courses/${id}/lecture`);
    },
    onError: (error) => {
      toast.error(error.response?.data || "Failed to delete lecture");
    },
  });

  const handleDeleteLecture = () => {
    deleteLectureMutation.mutate();
  };
  const { isPending: isLoadingDelete } = deleteLectureMutation;

  const isLoading = updatesLecturesMutation.isPending;

  return (
    <div className="bg-white min-h-screen px-4 py-8 md:px-10 text-slate-800">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <button
          onClick={() => navigate(`/admin/courses`)}
          className="bg-slate-200 text-slate-800 px-4 py-2 rounded-lg hover:bg-slate-300 transition duration-200 border border-slate-300"
        >
          Go Back
        </button>
        <h1 className="text-2xl font-bold text-slate-800">
          Update Your Lecture
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Sidebar Panel */}
        <div className="bg-white p-6 rounded-xl shadow-sm text-slate-800">
          <h2 className="text-xl font-semibold mb-2">Edit Lecture</h2>
          <p className="text-slate-600 mb-4">
            Make Changes And Click Save When Done
          </p>
          <button
            onClick={handleDeleteLecture}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
          >
            {isLoadingDelete ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 text-white" />
                Removing...
              </>
            ) : (
              <>Remove Lecture</>
            )}
          </button>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6 bg-white text-slate-800 p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">
              Title
            </label>
            <input
              type="text"
              placeholder="Enter a title for your lecture"
              value={lectureTitle}
              onChange={(e) => setLectureTitle(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">
              Description
            </label>
            <textarea
              placeholder="Enter a description for your lecture"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none h-32 resize-none transition text-slate-800 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">
              Video File *
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0] || null)}
              className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-slate-800 bg-white"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isVideoFree"
              checked={isVideoFree}
              onCheckedChange={(checked) => setVideoFree(checked)}
            />
            <Label htmlFor="isVideoFree" className="text-slate-800">Is This Video Free?</Label>
          </div>

          <div className="h-10 mb-4">
            {uploadProgress > 0 ? (
              <>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {uploadProgress}% uploaded
                </p>
              </>
            ) : null}
          </div>

          <button
            onClick={handleUpdateLecture}
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70 transition duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 text-white" />
                Updating...
              </>
            ) : (
              "Update Lecture"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
