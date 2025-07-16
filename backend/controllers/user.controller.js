import { hashedPassword } from "../utils/HashPassword.js";
import verifyUser from "../validations/user.validations.js";
import { User } from "../models/user.models.js";
import { deleteOldImage, uploadFile } from "../utils/Cloudinary.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const validationError = await verifyUser(req.body);

    if (validationError) {
      return res.status(400).send(validationError);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).send("User with the email already exists");
    }

    const HashPassword = await hashedPassword(password);

    const user = await User.create({
      name,
      email,
      password: HashPassword,
    });

    res.status(200).json({
      message: "User Registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please Enter Email and Password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const verifyUser = await user.isPasswordCorrect(password);
    if (!verifyUser) {
      return res.status(400).send("Authentication Failed");
    }

    const token = await user.getToken(user._id);

    const returnUser = user.toObject();
    delete returnUser.password;

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });

    return res.status(200).json({
      message: "User login successful",
      user: returnUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const getUser = async (req, res) => {
  try {
    const email = req.user.email;

    const user = await User.findOne({ email })
      .select("-password")
      .populate({
        path: "enrolledCourses",
        populate: {
          path: "creator",
          select: "name photoUrl", // Only send necessary fields
        },
      });

    if (!user) {
      return res.status(401).json({
        message: "User not Found",
        success: false,
      });
    }

    res.status(200).json({
      message: "user found",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const extractPublicId = (url) => {
  const parts = url.split("/upload/")[1]; 
  const [versionAndPath] = parts.split("."); 
  const publicId = versionAndPath
    .split("/")
    .slice(1) 
    .join("/");

  return publicId; 
};

export const editUser = async (req, res) => {
  try {
    const { name } = req.body;
    const { email } = req.user;
    const profilePhoto = req.file ? req.file.filename : null;
    const filePath = `./public/temp/${profilePhoto}`;
  

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User Not Found",
        success: false,
      });
    }

    if (user.photoUrl) {
      const publicId = extractPublicId(user.photoUrl);
      const deleteResponse = await deleteOldImage(publicId);

    }

    // upload on cloudinary
    const cloudinaryResponse = await uploadFile(filePath);
    const photoUrl = cloudinaryResponse.secure_url;

    //! update user
    user.name = name;
    user.photoUrl = photoUrl;

    await user.save();

    return res.status(200).json({
      message: "user updated successfully",
      user,
    });
  } catch (error) {
    console.log("Error from user update controller: ", error);
    res.status(500).json({
      message: "Failed to update profile",
      success: false,
    });
  }
};
