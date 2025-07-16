import axios from "axios";

const app = axios.create({
  baseURL: `${process.env.REACT_APP_CLIENT_URL}/course`,
  withCredentials: true,
});
export const createCourse = async (formData) => {
  const response = await app.post("/create", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getAllCourses = async () => {
  const res = await app.get("/fetch-courses", { withCredentials: true });
  return res.data;
};

export const fetchSingleCourse = async (id) => {
  const response = await app.get(`/get-single-course/${id}`, {
    withCredentials: true,
  });
  return response.data;
};

export const editCourses = async (data, id) => {
  const response = await app.put(`/edit-course/${id}`, data, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createLecture = async ({ id, lectureTitle }) => {
  const response = await app.post(
    `/${id}/create-lecture`,
    { lectureTitle },
    { withCredentials: true }
  );
  return response.data;
};

export const getCoursesLecture = async (id) => {
  const response = await app.get(`/${id}/lecture`, {
    withCredentials: true,
  });
  return response.data;
};

export const editLecture = async ({
  id,
  lectureId,
  formData,
  onUploadProgress,
}) => {
  const response = await app.post(`/${id}/lecture/${lectureId}`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
  return response.data;
};

export const getEditingLecture = async ({ id, lectureId }) => {
  const response = await app.get(`/${id}/lecture/${lectureId}`);
  return response.data;
};

export const delLecture = async ({ id, lectureId }) => {
  const response = await app.delete(`/${id}/lecture/${lectureId}`);
  return response.data;
};

export const publishCourse = async ({ id, isPublished }) => {
  const response = await app.put(
    `/${id}/publish`,
    { isPublished },
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const getPublishedCourses = async () => {
  const response = await app.get("/get-published")
  return response.data
}


export const getSearchedCourse = async ({ category, sortBy, query }) => {
  const response = await app.get("/search-courses", {
    params: { category, sortBy, query },
  });
  return response.data;
};


export const getAllPublishedCourses = async () => {
  const response = await app.get("/get-all-published-courses")
  return response.data
}

export const getSingleCourseProgress = async (id) => {
  const response = await app.get(`/get-user-course-progress/course/${id}`);
  return response.data;
};
