import React, { useEffect } from "react";
import logo from "../imgs/SCRAB Logo.svg";

const Loading = () => {
  // Simple timeout to show a message if loading takes too long
  const [showTimeoutMessage, setShowTimeoutMessage] = React.useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowTimeoutMessage(true);
    }, 10000); // after 10 seconds

    return () => clearTimeout(timeoutId); // Clear the timeout if the component unmounts
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <img className="loading-logo" src={logo} alt="Scrab" />
      <div
        style={{
          borderRadius: "5px",
          margin: "20px 0",
          width: "100px",
          height: "6px",
          background: "lightgray",
          position: "relative",
        }}
      >
        <div
          style={{
            borderRadius: "5px",
            width: "100%",
            height: "100%",
            background: "rgb(20, 45, 70)",
            animation: "loadingBar 2s infinite",
          }}
        ></div>
      </div>
      {showTimeoutMessage && <p>Just a couple more seconds</p>}
      <style>{`
        @keyframes loadingBar {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(1); }
          100% { transform: scaleX(0); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
