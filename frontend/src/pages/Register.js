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
  CircularProgress,
  Divider
} from "@mui/material";
import { Visibility, VisibilityOff, TravelExplore } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const IMAGE_BASE_URL = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000/api";

  const [data, setData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!data.name.trim()) return "Name is required";
    if (!emailRegex.test(data.email)) return "Enter a valid email address";
    if (!mobileRegex.test(data.mobile)) return "Enter a valid 10-digit mobile number";
    if (data.password.length < 6) return "Password must be at least 6 characters";

    return null;
  };

  const register = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await axios.post(`${API_BASE_URL}/register`, data);
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        backgroundImage: `url(${IMAGE_BASE_URL}/uploads/loginbg.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        justifyContent: "center",
        alignItems: "center",
        p: 0 // Reduced padding for outer box
      }}
    >
      <Paper
        elevation={15}
        sx={{
          width: 350, // Card is now smaller (Compact width)
          overflow: "hidden",
          backdropFilter: "blur(10px)",
          backgroundColor: "white",
          borderRadius: 4,
          textAlign: "center"
        }}
      >
        {/* Compact Header */}
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
            alt="Logo"
            sx={{ height: 100 }}
          />
        </Box>

        <Box sx={{ px: 3, pb: 3, pt: 1 }}> {/* Reduced internal padding */}
          <Typography variant="subtitle1" fontWeight="bold" color="secondary">
            Create Account
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
            Begin your divine journey ✨
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2, py: 0 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2, py: 0 }}>{success}</Alert>}

          <TextField
            label="Full Name" size="small" fullWidth sx={{ mb: 1.5 }}
            value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })}
          />

          <TextField
            label="Email" size="small" fullWidth sx={{ mb: 1.5 }}
            value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <TextField
            label="Mobile" size="small" fullWidth sx={{ mb: 1.5 }}
            value={data.mobile} 
            onChange={(e) => setData({ ...data, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
          />

          <TextField
            label="Password" size="small" type={showPassword ? "text" : "password"}
            fullWidth sx={{ mb: 2 }}
            value={data.password} onChange={(e) => setData({ ...data, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained" fullWidth size="medium" disabled={loading} onClick={register}
            sx={{ py: 1, fontWeight: "bold", borderRadius: 2, bgcolor: "#b83280", mb: 1.5 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : "Register"}
          </Button>

          <Typography variant="caption" sx={{ display: 'block', mb: 2, cursor: "pointer" }} onClick={() => navigate("/login")}>
            Already have an account? <strong style={{ color: "#1a237e" }}>Login</strong>
          </Typography>

          <Divider sx={{ mb: 2, fontSize: '0.7rem' }}>OR</Divider>

          <Button 
            variant="outlined" fullWidth startIcon={<TravelExplore />} 
            onClick={() => navigate("/")} 
            sx={{ 
              py: 0.8, fontSize: '0.8rem', textTransform: "none", fontWeight: "bold",
              color: "#ed8936", borderColor: "#ed8936", borderRadius: 2, borderWidth: 1.5,
              "&:hover": { borderWidth: 1.5, bgcolor: "rgba(237, 137, 54, 0.05)" }
            }}
          >
            Explore Tours First
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}