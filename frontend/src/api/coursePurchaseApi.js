import axios from "axios";

const app = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/progress',
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
