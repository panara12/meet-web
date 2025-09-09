import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../component/ui/errorMessage";
import { useResetPassword } from "../../hooks/auth/useResetPassword";
import { useSelector } from "react-redux";

function ResetPasswordPage() {
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.app.userEmail);
  useEffect(()=>{
    if(userEmail == null) navigate('/login')
  },[userEmail])

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const {mutate:resetPassword,isPending, isError, error} = useResetPassword()


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return <ErrorMessage message={"Passwords do not match!"}/>
    }

    resetPassword({userEmail,newPassword})
    
  };

  const onBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 brand-gradient-dark relative overflow-hidden text-white p-12">
        <div className="relative z-10 flex flex-col justify-center items-center text-center space-y-8 w-full">
          <img src="./logo.png" alt="" className="w-3/6" />
          <h1 className="text-4xl font-light">Reset Password</h1>
          <p className="text-lg max-w-md">
            Enter your new password below to regain access securely.
          </p>
        </div>
      </div>

      {/* Right Side - Reset Password Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md space-y-6">
          {/* Back Button */}
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-900">
              Set New Password
            </h2>
            <p className="text-gray-600">Enter and confirm your new password</p>
          </div>

          {/* Reset Password Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-xl p-6 space-y-5"
          >
            {/* New Password */}
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-lg border px-4 py-3 text-gray-700 focus:ring-2 focus:outline-none ${
                  confirmPassword && newPassword !== confirmPassword
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
                required
              />
              {/* Live check */}
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-sm text-red-600 mt-2">
                  Passwords do not match
                </p>
              )}
              {confirmPassword && newPassword === confirmPassword && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Passwords match
                </p>
              )}
            </div>

            {/* Error / Success Message */}
            {error && <ErrorMessage message={error} />}
            
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              disabled={isPending}
            >
              {isPending ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4">
            © 2025 Order Management System. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}


export default ResetPasswordPage