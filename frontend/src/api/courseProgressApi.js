import axios from "axios";

const app = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/courseProgress',
  withCredentials: true, // This will apply to all requests by default
});

// GET course progress
export const getCourseProgress = async (id) => {
  try {
    const response = await app.get(`${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// POST to mark a lecture as viewed
export const updateLectureProgress = async ({ id, lectureId }) => {
  try {
    const response = await app.post(`${id}/lecture/${lectureId}`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// POST to mark course as completed
export const markAsCompleted = async (id) => {
  try {
    const response = await app.post(`${id}/complete`, {}, {
      withCredentials: true, 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// POST to mark course as not completed
export const markAsInCompleted = async (id) => {
  try {
    const response = await app.post(`${id}/incomplete`, {}, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const markLectureIncomplete = async ({lectureId, id}) =>{
  try {
    const response = await app.post(`/${id}/lecture/${lectureId}/incomplete`, {}, {
      withCredentials: true
    })
    return response.data
  } catch (error) {
    throw error.response?.data || error;
  }
}
