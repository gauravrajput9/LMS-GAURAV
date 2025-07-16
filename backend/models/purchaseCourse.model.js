import mongoose from "mongoose";

const purchaseCourseSchema = new mongoose.Schema(
    {
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        paymentId: {
            type: String,
            required: true,
            trim: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["completed", "pending", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export const CoursePurchase = mongoose.model("CoursePurchase", purchaseCourseSchema);
