import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetLoggedUser } from "../hooks/auth/getLoggedUser"; // Add this

export function LoadingPage() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const { userRole, userData } = location.state || {};
  const [loadingText, setLoadingText] = useState("Initializing");
  
  // ✅ Wait for authentication to be confirmed
  const { data: loggedUser, isLoading: authLoading } = useGetLoggedUser();
  const userRolelogin = loggedUser?.user?.user_role;

  const messages = [
    "Initializing",
    "Loading components",
    "Connecting services",
    "Preparing dashboard",
    "Almost ready",
    "Welcome!"
  ];

  useEffect(() => {
    // ✅ Don't redirect until we have confirmed user data
    if (authLoading || !userRole) {
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 15;
        const clampedProgress = Math.min(newProgress, 100);
        
        const messageIndex = Math.floor((clampedProgress / 100) * (messages.length - 1));
        setLoadingText(messages[messageIndex]);
        
        if (clampedProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // ✅ Now it's safe to redirect
            if (userRole === "salesman") navigate("/salesman/dashboard", { replace: true });
            else if (userRole === "packaging") navigate("/packaging/dashboard", { replace: true });
            else if (userRole === "billing") navigate("/billing/dashboard", { replace: true });
            else navigate("/distributer/dashboard", { replace: true });
          }, 500);
        }
        
        return clampedProgress;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [userRole, authLoading, navigate]);
  // console.log("user role in loading page",userData);
  // ✅ If no user after auth check completes, go to login
  useEffect(() => {
    if (!userData && !loggedUser) {
      // console.log("no user role found, redirect to login in loading");
      navigate("/login", { replace: true });
    }
  }, [authLoading, loggedUser, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center overflow-hidden">
      {/* Background animated shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-100/30"
            style={{
              width: Math.random() * 200 + 100,
              height: Math.random() * 200 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        {/* Logo container with multiple animations */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 w-32 h-32 rounded-full border-4 border-blue-200 border-t-blue-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ transform: "scale(1.3)" }}
          />
          
          {/* Inner pulsing ring */}
          <motion.div
            className="absolute inset-0 w-32 h-32 rounded-full bg-blue-500/10"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Logo */}
          <motion.div
            className="relative w-32 h-32 flex items-center justify-center"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <img
              src='./logo.png'
              alt="Logo"
              className="w-24 h-24 object-contain drop-shadow-lg"
            />
          </motion.div>
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <motion.h2
            key={loadingText}
            className="text-2xl text-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loadingText}
          </motion.h2>
          
          {/* Loading dots animation */}
          <div className="flex items-center justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          className="w-80 max-w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Loading...</span>
            <span className="text-sm text-blue-600">{Math.round(progress)}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Floating elements around the logo */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-blue-400/60 rounded-full"
              style={{
                left: "50%",
                top: "50%",
              }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 150,
                y: Math.sin((i / 8) * Math.PI * 2) * 150,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}