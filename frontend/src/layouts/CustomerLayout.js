import { Box, CssBaseline } from "@mui/material";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import API from "../api";

export default function CustomerLayout({ children }) {

  const [isDown, setIsDown] = useState(false);

  useEffect(() => {
    const interceptor = API.interceptors.response.use(
      (res) => res,
      (err) => {
        if (!err.response || err.response.status >= 500) {
          setIsDown(true);
        }
        return Promise.reject(err);
      }
    );
    return () => API.interceptors.response.eject(interceptor);
  }, []);
  if (isDown) {
    return (
      <div className="maintenance-overlay">
        <h1>Server is taking a nap 😴</h1>
        <p>We're fixing things. Try refreshing in a minute.</p>
        <button onClick={() => setIsDown(false)}>Try Again</button>
      </div>
    );
  }
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Navbar />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
