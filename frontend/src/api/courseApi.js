import axios from "axios";

const app = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/course',
  withCredentials: true,
});
export const createCourse = async (formData) => {
  try {
    const response = await app.post("/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllCourses = async () => {
  try {
    const res = await app.get("/fetch-courses", { withCredentials: true });
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const fetchSingleCourse = async (id) => {
  try {
    const response = await app.get(`/get-single-course/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const editCourses = async (data, id) => {
  try {
    const response = await app.put(`/edit-course/${id}`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const createLecture = async ({ id, lectureTitle }) => {
  try {
    const response = await app.post(
      `/${id}/create-lecture`,
      { lectureTitle },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getCoursesLecture = async (id) => {
  try {
    const response = await app.get(`/${id}/lecture`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const editLecture = async ({
  id,
  lectureId,
  formData,
  onUploadProgress,
}) => {
  try {
    const response = await app.post(`/${id}/lecture/${lectureId}`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getEditingLecture = async ({ id, lectureId }) => {
  try {
    const response = await app.get(`/${id}/lecture/${lectureId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const delLecture = async ({ id, lectureId }) => {
  try {
    const response = await app.delete(`/${id}/lecture/${lectureId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const publishCourse = async ({ id, isPublished }) => {
  try {
    const response = await app.put(
      `/${id}/publish`,
      { isPublished },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPublishedCourses = async () => {
  try {
    const response = await app.get("/get-published")
    return response.data
  } catch (error) {
    throw error.response?.data || error;
  }
}

export const getSearchedCourse = async ({ category, sortBy, query }) => {
  try {
    const response = await app.get("/search-courses", {
      params: { category, sortBy, query },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getAllPublishedCourses = async () => {
  try {
    const response = await app.get("/get-all-published-courses")
    return response.data
  } catch (error) {
    throw error.response?.data || error;
  }
}

export const getSingleCourseProgress = async (id) => {
  try {
    const response = await app.get(`/get-user-course-progress/course/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
