import { Link } from "react-router-dom";
import { AlertTriangle, LogIn } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border-2 border-blue-500 rounded-xl shadow-lg p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-14 h-14 text-blue-600" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          404 - Page Not Found
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Login Button */}
        <Link
          to="/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Go to Login
        </Link>

        {/* Footer note */}
        <p className="text-xs text-gray-400 mt-6">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
