// components/LogoutAnimation.jsx
import React from "react";
import Lottie from "lottie-react";
import logoutAnimation from "../Animations/logout.json"; // add your animation file

export default function LogoutAnimation() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.8)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Lottie animationData={logoutAnimation} loop={false} style={{ width: 300 }} />
    </div>
  );
}
