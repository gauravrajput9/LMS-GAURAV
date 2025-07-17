import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/user',
  withCredentials: true,
});

export const loginUser = async (credentials) => {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const registerUser = async (credentials) => {
  try {
    const response = await api.post("/register", credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.get("/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const loadUser = async () => {
  try {
    const response = await api.get("/getUser");
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const updateUser = async (data) => {
  try {
    const response = await api.post("/edit-user", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
