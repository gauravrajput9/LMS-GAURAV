import { Course } from "../models/courses.models.js";
import { deleteOldImage, uploadFile } from "../utils/Cloudinary.js";
import { extractPublicId } from "../utils/ExtractPublicID.js";
import mongoose from "mongoose";

const CreateCourse = async (req, res) => {


  try {
    const { courseTitle, category } = req.body;
    const creator = req.user?._id.toString();

    const localCourseImage = req.file ? req.file?.filename : null;
    const filePath = `./public/temp/${localCourseImage}`;

    if (!courseTitle || !category || !localCourseImage) {
      return res.status(400).json({
        message: "Please Enter Title,Course and Course Image",
        success: false,
      });
    }

    const existing = await Course.findOne({ courseTitle });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Course already exists",
      });
    }

    const cloudinaryResponse = await uploadFile(filePath);
    const courseImage = cloudinaryResponse.secure_url;

    const course = await Course.create({
      courseTitle,
      category,
      courseImage,
      creator,
    });

    return res.status(200).json({
      message: "Course Created Successfully",
      course,
    });
  } catch (error) {
    console.log("Course Create Error: ", error);
    res.status(500).send("Internal Server Error");
  }
};

export const GetAllAdminCourses = async (req, res) => {


  try {
    const adminId = req.user?._id;

    const courses = await Course.find({ creator: adminId });
    if (!courses) {
      return res.status(400).json({
        message: "Unable to fetch courses",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Courses fetched Fetched Successfully",
      courses,
    });
  } catch (error) {
    console.log("Courses fetch error: ", error);
    return res.status(500).send("Course fetch unsuccessfull");
  }
};

export const getSingleCourse = async (req, res) => {


  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    const course = await Course.findById(id);
    if (!course) {
      return res.status(500).json({
        message: "Couldn't fetch Course",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Fetched Prev Course data...",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

export const editCourse = async (req, res) => {


  try {
    const filePath = req.file?.path;
    const data = JSON.parse(req.body.courseData);
    const {
      courseTitle,
      category,
      coursePrice,
      description,
      subtitle,
      courseLevel,
    } = data;
    const courseId = req.params.id;
    if (!data.courseTitle || data.courseTitle.trim().length === 0) {
      return res.status(400).json({ message: "Course title is required" });
    }
    if (data.description.length < 30) {
      return res
        .status(400)
        .json({ message: "Description must be at least 30 characters" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(500).json({
        message: "Course not found",
        success: false,
      });
    }

    if (course.courseImage) {
      const publicId = extractPublicId(course.courseImage);
      const res = await deleteOldImage(publicId);
      if (res) {
        console.log("deleted previous file successfully", res);
      }
    }

    const cloudinaryResponse = await uploadFile(filePath);
    const courseImage = cloudinaryResponse.secure_url;

    course.courseTitle = courseTitle;
    course.courseImage = courseImage;
    course.description = description;
    course.coursePrice = coursePrice;
    course.courseLevel = courseLevel;
    course.subtitle = subtitle;
    course.category = category;

    course.save();

    console.log(course);

    return res.status(200).json({
      message: "course updated successfully",
      course,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to edit course",
      success: false,
    });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl"
    }).populate({
      path: "lectures",
      select: "-__v",
    });

    return res.status(200).json({
      courses,
      message: "Fetched course and the creator successfully"
    })

  } catch (error) {
    console.log("Get published course Error: ", error)
    return res.status(500).send("Internal Server error")
  }
}

 
export const getSearchedCourse = async (req, res) => {
  try {
    const { category, sortBy, query } = req.query;
    const filter = { isPublished: true };
    const orConditions = [];

    // Fuzzy search via RegEx
    if (query) {
      const searchRegex = new RegExp(query, "i");
      orConditions.push(
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { category: { $regex: searchRegex } }
      );
    }

    // Fuzzy category match
    if (category) {
      const categories = category.split(",").map((cat) => cat.trim());
      categories.forEach((cat) => {
        const catRegex = new RegExp(cat, "i");
        orConditions.push(
          { category: { $regex: catRegex } },
          { title: { $regex: catRegex } }
        );
      });
    }

    if (orConditions.length > 0) filter.$or = orConditions;

    const sort = {};
    if (sortBy === "low-to-high") sort.price = 1;
    if (sortBy === "high-to-low") sort.price = -1;

    const courses = await Course.find(filter)
      .populate("creator", "name photoUrl")
      .sort(sort);

    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Course Search Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
    if (!courses) {
      return res.status(404).send("No Courses Published Yet")
    }
    return res.status(200).json({
      courses
    })

  } catch (error) {
    console.log(error)
  }
}
export default CreateCourse;
