import { Link, Outlet, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-4 overflow-y-auto rounded-r-3xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center tracking-wide">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <Link
            to="dashboard"
            className={`px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-lg ${
              isActive("dashboard") ? "bg-indigo-800" : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="courses"
            className={`px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium text-lg ${
              isActive("courses") ? "bg-indigo-800" : ""
            }`}
          >
            Courses
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 bg-gray-100 dark:bg-zinc-900">
        <Outlet />
      </main>
    </div>
  );
};

export default SideBar;
