import React, { useEffect, useState } from "react";

const SuccessMessage = ({ message, duration = 4000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible || !message) return null;

  return (
    <div className="fixed top-5 right-5 z-50">
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-lg shadow-md text-sm font-medium animate-fade-in">
        {message}
      </div>
    </div>
  );
};

export default SuccessMessage;
