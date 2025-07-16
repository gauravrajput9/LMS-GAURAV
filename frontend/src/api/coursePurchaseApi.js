import axios from "axios";

const app = axios.create({
    baseURL: "http://localhost:3000/purchase",
    withCredentials: true
})

export const createCheckoutSession = async (id) => {
    const response = await app.post("/checkout/create-checkout-session", id)
    return response.data
}

export const webhook = async () => {
    const response = await app.post("/webhook")
    return response.data
}

export const getPurchasedCourse = async (id) => {
    const response = await app.post(`/get-purchased-course/${id}`)
    return response.data
}