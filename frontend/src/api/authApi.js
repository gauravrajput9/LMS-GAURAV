import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_BASE_URL}/user`,
  withCredentials: true,
});

export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

export const registerUser = async (credentials) => {
  const response = await api.post("/register", credentials);
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get("/logout");
  return response.data;
};

export const loadUser = async () => {
  const response = await api.get("/getUser");
  return response.data;
};

export const updateUser = async (data) => {
  const response = await api.post("/edit-user", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
