import { Link, Outlet, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4 overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link
            to="dashboard"
            className={`px-4 py-2 rounded hover:bg-gray-700 transition ${
              isActive("dashboard") ? "bg-gray-700" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="courses"
            className={`px-4 py-2 rounded hover:bg-gray-700 transition ${
              isActive("courses") ? "bg-gray-700" : ""
            }`}
          >
            Courses
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default SideBar;
