import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["instructor", "student"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    photoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.isPasswordCorrect = async function (userPassword) {
  const ans = await bcrypt.compare(userPassword, this.password);
  return ans;
};

userSchema.methods.getToken = async function (id) {
  const token = await jwt.sign(
    { email: this.email, user_id: id },
    process.env.DIGITAL_SIGNATURE_KEY,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

export const User = mongoose.model("User", userSchema);
