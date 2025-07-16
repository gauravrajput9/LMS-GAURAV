import { Course } from "../models/courses.models.js";
import { Lecture } from "../models/lecture.model.js";
import {
  deleteOldImage,
  deleteVideoFromCloudinary,
  uploadFile,
} from "../utils/Cloudinary.js";

export const createLecture = async (req, res) => {
  

  try {
    const courseId = req.params.id;
    const { lectureTitle } = req.body;

    if (!lectureTitle || !courseId) {
      return res.status(400).json({
        message: "Lecture Title and Course ID are required",
        success: false,
      });
    }

    const existingLecture = await Lecture.findOne({ lectureTitle });
    if (existingLecture) {
      return res.status(409).json({
        // Conflict
        message: "The Lecture Already Exists",
        success: false,
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(204).json({
        message: "Course not found",
        success: false,
      });
    }

    const lecture = await Lecture.create({ lectureTitle, courseId });
    course.lectures.push(lecture._id);
    await course.save();

    return res.status(201).json({
      lecture,
      message: "Lecture Created Successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create lecture",
      success: false,
    });
  }
};

// ------------------- Get All Lectures for a Course -------------------
export const getCourseLectures = async (req, res) => {
  

  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId).populate("lectures");

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      lectures: course.lectures || [],
      message:
        course.lectures.length > 0
          ? "Lectures fetched successfully"
          : "No lectures available for this course",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch course lectures",
      success: false,
    });
  }
};

// ------------------- Extract Cloudinary Public ID -------------------
const extractPublicId = (url) => {
  

  try {
    const afterUpload = url.split("/upload/")[1];
    const noExtension = afterUpload.split(".").slice(0, -1).join(".");
    const segments = noExtension.split("/");
    if (/^v\d+$/.test(segments[0])) segments.shift();
    return segments.join("/");
  } catch (error) {
    console.error("Error extracting publicId:", error);
    return null;
  }
};

// ------------------- Edit Lecture -------------------
export const editLecture = async (req, res) => {
  

  try {
    const id = req.params.id;
    const lectureId = req.params.lectureId;
    const { lectureTitle, description, isVideoFree } = req.body;
    const filePath = req.file?.path;

    if (!lectureTitle || !filePath) {
      return res.status(400).json({
        message: "Lecture Title and Video File are mandatory",
        success: false,
      });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        message: "Lecture not found",
        success: false,
      });
    }

    if (lecture.videoUrl) {
      const publicId = extractPublicId(lecture.videoUrl);
      await deleteOldImage(publicId);
    }

    const cloudinaryResponse = await uploadFile(filePath);
    console.log(cloudinaryResponse)
    const videoUrl = cloudinaryResponse.secure_url;
    const newPublicId = extractPublicId(videoUrl);

    lecture.videoUrl = videoUrl;
    lecture.duration = cloudinaryResponse.duration
    lecture.publicId = newPublicId;
    lecture.lectureTitle = lectureTitle;
    if (description) lecture.description = description;
    if (isVideoFree !== undefined) lecture.isFree = isVideoFree;

    await lecture.save();

    const course = await Course.findById(id);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    return res.status(200).json({
      message: "Lecture Updated Successfully",
      lecture,
      success: true,
    });
  } catch (error) {
    console.error("Update Lecture Error: ", error);
    return res.status(500).json({
      message: "Lecture update failed",
      success: false,
    });
  }
};

// ------------------- Get Single Lecture -------------------
export const getEditingLecture = async (req, res) => {
  

  try {
    const lecture = await Lecture.findById(req.params.lectureId);
    if (!lecture) {
      return res.status(204).json({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("Get lecture error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch lecture",
    });
  }
};

// ------------------- Delete Lecture -------------------
export const deleteLecture = async (req, res) => {
  

  try {
    const { id, lectureId } = req.params;

    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(204).json({
        message: "Lecture not found",
        success: false,
      });
    }

    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $pull: { lectures: lectureId } },
      { new: true }
    );

    if (!course) {
      return res.status(204).json({
        message: "Course not found for this lecture",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Lecture deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting lecture: ", error);
    return res.status(500).json({
      message: "Failed to delete lecture",
      success: false,
    });
  }
};

// ------------------- Publish / Unpublish Course -------------------
export const handlePublish = async (req, res) => {
  

  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(204).json({
        message: "Course not found",
        success: false,
      });
    }

    course.isPublished = isPublished;
    await course.save();

    return res.status(200).json({
      message: `Course ${isPublished ? "Published" : "Unpublished"} Successfully`,
      success: true,
    });
  } catch (error) {
    console.error("Publish Error: ", error);
    return res.status(500).json({
      message: "Failed to update publish status",
      success: false,
    });
  }
};
