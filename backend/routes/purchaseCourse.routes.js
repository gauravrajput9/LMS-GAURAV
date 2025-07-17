import express from "express"
import { isAuthenticated } from "../middlewares/isAuthenticated.middleware.js"
import { createCheckoutSession, getCourseWithPurchaseStatus, stripeWebhook } from "../controllers/coursePurchase.controller.js"

const purchaseRouter = express.Router()

purchaseRouter.route("/checkout/create-checkout-session").post(isAuthenticated,createCheckoutSession)

purchaseRouter.post("/webhook", stripeWebhook);
purchaseRouter.route("/:id/detail-with-status").get(isAuthenticated)
purchaseRouter.route("/get-purchased-course/:id").post(isAuthenticated, getCourseWithPurchaseStatus)

export default purchaseRouter   