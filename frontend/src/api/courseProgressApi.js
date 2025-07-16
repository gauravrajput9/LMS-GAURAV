import axios from "axios";

const app = axios.create({
  baseURL: "http://localhost:3000/courseProgress",
  withCredentials: true, // This will apply to all requests by default
});

// GET course progress
export const getCourseProgress = async (id) => {
  const response = await app.get(`${id}`);
  return response.data;
};

// POST to mark a lecture as viewed
export const updateLectureProgress = async ({ id, lectureId }) => {
  const response = await app.post(`${id}/lecture/${lectureId}`, {}, {
    withCredentials: true,
  });
  return response.data;
};

// POST to mark course as completed
export const markAsCompleted = async (id) => {
  const response = await app.post(`${id}/complete`, {}, {
    withCredentials: true, 
  });
  return response.data;
};

// POST to mark course as not completed
export const markAsInCompleted = async (id) => {
  const response = await app.post(`${id}/incomplete`, {}, {
    withCredentials: true,
  });
  return response.data;
};

export const markLectureIncomplete = async ({lectureId, id}) =>{
    const response = await app.post(`/${id}/lecture/${lectureId}/incomplete`, {}, {
        withCredentials: true
    })
    return response.data
}
