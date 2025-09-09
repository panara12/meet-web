import { useState, useEffect } from "react";
import {
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Shield,
  User,
  Package,
  CreditCard,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import sendForgotPasswordEmail from '../../utils/emailService'
import ErrorMessage from "../../component/ui/errorMessage";
import { useDispatch } from "react-redux";
import {setResetEmail} from '../../store/slice/appSlice'

export default function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState();
  const navigate = useNavigate()
  

  const canResetPassword = userType === "administrator" || userType === "vendor";

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: "administrator",
      name: "Administrator",
      icon: <Shield className="w-5 h-5 text-red-500" />,
      color: "border-red-200 bg-red-50",
    },
    {
      id: "vendor",
      name: "Vendor",
      icon: <Truck className="w-5 h-5 text-orange-500" />,
      color: "border-orange-200 bg-orange-50",
    },
    {
      id: "sales-person",
      name: "Sales Person",
      icon: <User className="w-5 h-5 text-green-500" />,
      color: "border-green-200 bg-green-50",
    },
    {
      id: "packing-department",
      name: "Packing Department",
      icon: <Package className="w-5 h-5 text-blue-500" />,
      color: "border-blue-200 bg-blue-50",
    },
    {
      id: "billing-department",
      name: "Billing Department",
      icon: <CreditCard className="w-5 h-5 text-purple-500" />,
      color: "border-purple-200 bg-purple-50",
    },
  ];

  // 🔹 Sync selectedRole with userType
  useEffect(() => {
    if (selectedRole) {
      setUserType(selectedRole.id);
    }
  }, [selectedRole]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setIsOpen(false);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if (!canResetPassword) return;
      dispatch(setResetEmail(email));
    const res = await sendForgotPasswordEmail({email})
    console.log(res);
    if(res.success){
      navigate('/otpverification')
    }
    setIsLoading(false)
    setError(res.message)
  };

  const onBackToLogin =(e)=>{
    navigate('/login')
  }


  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 brand-gradient-dark relative overflow-hidden text-white p-12">
        <div className="relative z-10 flex flex-col justify-center items-center text-center space-y-8 w-full">
          <img src="./logo.png" alt="" className="w-3/6" />
          <h1 className="text-4xl font-light">Password Recovery</h1>
          <p className="text-lg max-w-md">
            Secure password reset for authorized personnel only
          </p>
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 max-w-sm">
            <div className="flex items-center gap-2 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>
                Only Administrators and Vendors can reset their passwords
                independently.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
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
              Forgot Password
            </h2>
            <p className="text-gray-600">
              Enter your details to reset your password
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSendOTP}
            className="bg-white shadow-lg rounded-xl p-6 space-y-5"
          >
            {/* Select Role */}
            <div className="relative w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Your Role
              </label>

              {/* Dropdown Toggle */}
              <div
                className={`relative w-full bg-white border-2 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200 ${
                  isOpen
                    ? "border-blue-500 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setIsOpen(!isOpen)}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={selectedRole ? "text-gray-900" : "text-gray-500"}
                  >
                    {selectedRole ? selectedRole.name : "Choose your department"}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>

              {/* Dropdown Menu */}
              {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {roles.map((role) => {
                    const isDisabled =
                      role.id === "sales-person" ||
                      role.id === "packing-department" ||
                      role.id === "billing-department"; // disable these 3

                    return (
                      <div
                        key={role.id}
                        className={`flex items-center gap-3 px-4 py-3 transition-colors duration-150 
                          ${isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50 cursor-pointer"}
                          ${selectedRole?.id === role.id ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}
                        onClick={() => !isDisabled && handleRoleSelect(role)}
                      >
                        <div className={`p-2 rounded-lg border ${role.color}`}>
                          {role.icon}
                        </div>
                        <span className="text-gray-900 font-medium">{role.name}</span>
                        {selectedRole?.id === role.id && !isDisabled && (
                          <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}


              {/* Backdrop for mobile */}
              {isOpen && (
                <div
                  className="fixed inset-0 z-40 bg-black bg-opacity-20 md:hidden"
                  onClick={() => setIsOpen(false)}
                />
              )}
            </div>

            {/* Phone Input */}
            {userType && (
              <div>
                <label
                  htmlFor="Email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Registered Email Address
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter your registered Email Adderrs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                  disabled={!canResetPassword}
                />
              </div>
            )}

            {/* Alerts */}
            {userType && !canResetPassword && (
              <div className="flex items-start gap-2 text-sm border border-orange-200 bg-orange-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                <span className="text-orange-800">
                  Password reset is not available for your role. Contact admin.
                </span>
              </div>
            )}

            {userType && canResetPassword && (
              <div className="flex items-start gap-2 text-sm border border-blue-200 bg-blue-50 p-3 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-blue-600 mt-0.5" />
                <span className="text-blue-800">
                  An OTP will be sent to your registered Email Address.
                </span>
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="w-full h-12 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
              disabled={!canResetPassword || isLoading}
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
              {
                error &&  <ErrorMessage message={error} />
              }
            </button>
          </form>

          {/* Support */}
          <div className="text-center text-sm text-gray-500">
            <p>Need help with password reset?</p>
            <p className="text-blue-600 font-medium">
              Contact IT Support: +1 (555) 123-4567
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 pt-4">
            © 2025 Order Management System. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
