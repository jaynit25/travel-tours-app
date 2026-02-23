import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Alert,
  Divider
} from "@mui/material";
import { Visibility, VisibilityOff, TravelExplore } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const IMAGE_BASE_URL = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      if (res.data.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        backgroundImage: `url(${IMAGE_BASE_URL}/uploads/loginbg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 0, // Set to 0 to let the logo background hit the edges
          width: 400,
          overflow: "hidden", // Keeps the logo background corners rounded
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderRadius: 5,
          textAlign: "center"
        }}
      >
        {/* Header Section with logobg */}
        <Box 
          sx={{ 
            backgroundImage: `url(${IMAGE_BASE_URL}/uploads/logobg.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            py: 3,
          }}
        >
          <Box 
            component="img"
            src={`${IMAGE_BASE_URL}/uploads/applogo.png`}
            alt="Khodiyar Global Holidays"
            sx={{ height: 100 }}
          />
        </Box>

        <Box sx={{ px: 5, pb: 5, pt: 1 }}>
          <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Embark on your next Divine Journey ✨
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <TextField
            label="Email Address"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            sx={{ mb: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={login}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              borderRadius: 3,
              bgcolor: "#1a237e",
              mb: 2,
              transition: "0.3s",
              "&:hover": { transform: "translateY(-2px)", bgcolor: "#0d1440" },
            }}
          >
            Sign In
          </Button>

          <Typography
            variant="body2"
            sx={{ mb: 3, cursor: "pointer" }}
            onClick={() => navigate("/register")}
          >
            New here? <strong style={{ color: "#ed8936" }}>Create Account</strong>
          </Typography>

          <Divider sx={{ mb: 3 }}>OR</Divider>

          {/* Highlighted Explore Button */}
          <Button 
            variant="outlined"
            fullWidth
            startIcon={<TravelExplore />} 
            onClick={() => navigate("/")} 
            sx={{ 
              py: 1.2,
              textTransform: "none", 
              fontWeight: "bold",
              color: "#ed8936", 
              borderColor: "#ed8936",
              borderRadius: 3,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
                borderColor: "#cc6a1d",
                bgcolor: "rgba(237, 137, 54, 0.05)",
                transform: "translateY(-2px)"
              }
            }}
          >
            Just Explore Tours
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}