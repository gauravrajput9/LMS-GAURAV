import axios from "axios";

const app = axios.create({
    baseURL: import.meta.env.VITE_API_URL + '/purchase',
    withCredentials: true
})

export const createCheckoutSession = async (id) => {
    try {
        const response = await app.post("/checkout/create-checkout-session", id)
        return response.data
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const webhook = async () => {
    try {
        const response = await app.post("/webhook")
        return response.data
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const getPurchasedCourse = async (id) => {
    try {
        const response = await app.get(`/${id}/detail-with-status`, { withCredentials: true });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
}
