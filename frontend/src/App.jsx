import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/login";
import MainLayout from "./layout/MainLayout";
import Home from "./pages/student/Home";
import MyLearning from "./pages/student/MyLearning";
import Profile from "./pages/student/Profile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadUser } from "./api/authApi";
import { userLoggedIn, userLoggedOut } from "./features/authSlice";
import Dashboard from "./pages/admin/Dashboard";
import CourseTable from "./pages/admin/CourseTable";
import SideBar from "./pages/admin/SideBar";
import AddCourse from "./pages/admin/AddCourse";
import EditCourse from "./pages/admin/EditCourse";
import ProtectedRoute from "./routes/ProtectedRoutes";
import CreateLecture from "./pages/admin/CreateLecture";
import { EditLecture } from "./pages/admin/EditLecture";
import "./App.css";
import CourseProgress from "./pages/student/CourseProgress";
import RenderCourseDetails from "./pages/student/RenderCourseDetails";
import SearchCourses from "./pages/student/SearchCourses";
import Unauthorized from "./components/Unauthorized";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/course/search-courses",
        element: <SearchCourses />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "my-learning",
        element: <MyLearning />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "course-details/:id",
        element: <RenderCourseDetails />,
      },
      {
        path: "get-purchased-course/:id",
        element: <RenderCourseDetails />,
      },
      {
        path: "courseProgress/:id",
        element: <CourseProgress />,
      },

      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["instructor", "admin"]}>
            <SideBar />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "courses",
            element: <CourseTable />,
          },
          {
            path: "courses/create-course",
            element: <AddCourse />,
          },
          {
            path: "courses/:id",
            element: <EditCourse />,
          },
          {
            path: "courses/:id/lecture",
            element: <CreateLecture />,
          },
          {
            path: "courses/:id/lecture/:lectureId",
            element: <EditLecture />,
          },
        ],
      },
    ],
  },
]);

export default function App() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await loadUser();
        dispatch(userLoggedIn({ user: data.user }));
      } catch (error) {
        console.log("Error from App.jsx", error);
        dispatch(userLoggedOut());
      }
    };

    fetchUser();
  }, [dispatch]);

  if (loading) {
    return <div className="text-center p-10">Loading...</div>;
  }

  return <RouterProvider router={router} />;
}
