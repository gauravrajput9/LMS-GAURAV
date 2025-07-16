import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white px-4">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <Lock size={64} className="text-red-500" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-lg text-gray-300 mb-6">
          You must be logged in to access this page. Please log in with an authorized account.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button variant="default">Go to Login</Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="border-gray-400 text-black hover:text-white hover:bg-gray-700">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
