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
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  // 🔹 Separate base URLs properly
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

  // ✅ Validation
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!data.name.trim()) return "Name is required";
    if (!emailRegex.test(data.email)) return "Enter a valid email address";
    if (!mobileRegex.test(data.mobile))
      return "Enter a valid 10-digit mobile number";
    if (data.password.length < 6)
      return "Password must be at least 6 characters";

    return null;
  };

  // ✅ Register Function
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
      setError(
        err.response?.data?.message || "Something went wrong. Try again."
      );
    } finally {
      setLoading(false);
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
          p: 5,
          width: 400,
          backdropFilter: "blur(10px)",
          backgroundColor: "white",
          borderRadius: 3,
        }}
      >
        {/* Logo */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Box
            component="img"
            src={`${IMAGE_BASE_URL}/uploads/applogo.png`}
            alt="Khodiyar Global Holidays"
            sx={{ height: 120, mb: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            Create your account & begin your divine journey ✨
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <TextField
          label="Full Name"
          fullWidth
          sx={{ mb: 2 }}
          value={data.name}
          onChange={(e) =>
            setData({ ...data, name: e.target.value })
          }
        />

        <TextField
          label="Email Address"
          type="email"
          fullWidth
          sx={{ mb: 2 }}
          value={data.email}
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <TextField
          label="Mobile Number"
          fullWidth
          sx={{ mb: 2 }}
          value={data.mobile}
          onChange={(e) =>
            setData({
              ...data,
              mobile: e.target.value.replace(/\D/g, "").slice(0, 10),
            })
          }
          placeholder="10-digit mobile number"
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          sx={{ mb: 3 }}
          value={data.password}
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={loading}
          onClick={register}
          sx={{
            py: 1.2,
            fontWeight: "bold",
            borderRadius: 2,
            transition: "0.3s",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          {loading ? <CircularProgress size={24} /> : "Register"}
        </Button>

        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Already have an account? <strong>Login</strong>
        </Typography>
      </Paper>
    </Box>
  );
}