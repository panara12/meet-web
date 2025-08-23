// src/components/Loader.js
import React from "react";
import planeLoading from "../assets/loadingGif/loading.gif"; // adjust path

const LoadingGif = ({ size = 100 }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <img
        src={planeLoading}
        alt="Loading..."
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default LoadingGif;
