import React, { useState, useEffect } from "react";
import "./styles.css";

const ErrorMessage = ({ message, r, type }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Start the timer to hide the error message after 3 seconds
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [r, type]);

  const handleAnimationEnd = () => {
    // Remove the error message from the DOM after the animation ends
    if (!isVisible) {
      // Handle any additional cleanup or state updates if needed
    }
  };

  return (
    <div
      className={`error-message ${isVisible ? "" : "hidden"} ${
        type == 0 ? "error" : "success"
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      {message}
    </div>
  );
};

export default ErrorMessage;
