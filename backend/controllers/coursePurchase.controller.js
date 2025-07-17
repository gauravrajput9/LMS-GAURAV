import Stripe from "stripe";
import { Course } from "../models/courses.models.js";
import { CoursePurchase } from "../models/purchaseCourse.model.js";
import { User } from "../models/user.models.js";
import { Lecture } from "../models/lecture.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.body;


    const course = await Course.findById(id);
    if (!course) return res.status(404).send("Course not found!");

    const newPurchase = new CoursePurchase({
      courseId: id,
      userId,
      amount: course.coursePrice,
      status: "pending",
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
              description: course.courseDescription,
            },
            unit_amount: course.coursePrice * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId.toString(),
        id: course._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/courseProgress/${id}`,
      cancel_url: `${process.env.CLIENT_URL}/course-detail/${id}`,
    });

    if (!session.url) return res.status(400).send("Error while creating session");

    newPurchase.paymentId = session.id;
    await newPurchase.save();

    return res.status(200).json({
      url: session.url,
      message: "Session created successfully",
    });
  } catch (error) {
   console.error("Payment session error:", {
    message: error.message,
    stack: error.stack,
    cause: error.cause,
  });
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const stripeWebhook = async (req, res) => {


  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }


  if (event.type === "checkout.session.completed") {
    const session = event.data.object;


    try {
      const purchase = await CoursePurchase.findOne({ paymentId: session.id }).populate({
        path: "courseId",
        populate: {
          path: "lectures",
          model: "Lecture",
        },
      });

      if (!purchase) {
        console.warn("⚠️ Purchase not found for session ID:", session.id);
        return res.status(404).json({ message: "Purchase not found" });
      }

      if (purchase.status === "completed") {
        console.log("ℹ️ Purchase already completed. Skipping.");
        return res.status(200).send();
      }

      // Update purchase
      purchase.amount = session.amount_total / 100;
      purchase.status = "completed";
      await purchase.save();


      // Mark lectures as accessible
      if (purchase.courseId?.lectures?.length > 0) {
        await Lecture.updateMany(
          { _id: { $in: purchase.courseId.lectures.map((l) => l._id) } },
          { $set: { isPreviewFree: true } }
        );

      }

      // Update user
      await User.findByIdAndUpdate(
        purchase.userId,
        { $addToSet: { enrolledCourses: purchase.courseId._id } }
      );

      // Update course
      await Course.findByIdAndUpdate(
        purchase.courseId._id,
        { $addToSet: { enrolledStudents: purchase.userId } }
      );


      return res.status(200).json({
        purchase
      });
    } catch (error) {
      console.error("❌ Error processing webhook event:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Respond for other events
  return res.status(200).send();
};


export const getCourseWithPurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

 

    const course = await Course.findById(id).populate({ path: "creator" }).populate({ path: "lectures" })

    const purchased = await CoursePurchase.findOne({ courseId: id, userId })
   
    if (!course) {
      return res.status(404).send("Cannot find the user purchased course")
    }

    return res.status(200).json({
      course,
      purchased: purchased ? true : false,
      message: "User Bought Course Found successfully"
    })

  } catch (error) {
    console.log(error)
    return res.status(500).send("Internal Server Error")
  }
}
