import React from "react";

const MobileFooter = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white py-3 text-center z-50 shadow-md">
      <div className="max-w-screen-md mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-center sm:text-left">&copy; {new Date().getFullYear()} MyApp</p>
        <div className="flex gap-3 justify-center sm:justify-end">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Help</a>
        </div>
      </div>
    </footer>
  );
};

export default MobileFooter;
