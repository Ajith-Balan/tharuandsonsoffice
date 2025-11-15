import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = () => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    if (count === 0) {
      navigate("/login", { state: location.pathname });
    }

    return () => clearInterval(interval);
  }, [count, navigate, location]);

  return (
   <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
  {/* <h1 className="text-2xl font-bold text-gray-800 text-center mb-6 tracking-wide animate-pulse">
    Redirecting you in{" "}
    <span className="text-indigo-600">{count}</span> second
    {count !== 1 && "s"}...
  </h1> */}

  {/* Spinner container */}
  <div className="relative w-24 h-24 flex items-center justify-center">
    {/* Soft glowing background */}
    {/* <div className="absolute w-24 h-24 bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-70 animate-pulse"></div> */}

    {/* Smooth outer ring */}
    <div className="absolute w-16 h-16 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin [animation-duration:1.5s]"></div>

    {/* Center dot */}
    <div className="w-5 h-5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-400/50 animate-ping [animation-duration:2s]"></div>
  </div>
</div>

  );
};

export default Spinner;
