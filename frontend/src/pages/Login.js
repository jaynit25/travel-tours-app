import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Alert
} from "@mui/material";
import { Visibility, VisibilityOff, FlightTakeoff } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/login`,
        { email, password }
      );

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
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
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
        <Box sx={{ textAlign: "center", mb: 3 }}>
		  <Box 
			component="img"
			src={`${API_BASE_URL}/uploads/applogo.png`}
			alt="Khodiyar Global Holidays"
			sx={{ height: 150, mb: 1 }}
		  />
		  <Typography variant="body2" color="text.secondary">
			{/* Dynamic text based on page */}
			Welcome back! Embark on Divine Journeys. 
		  </Typography>
		</Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email Address"
          type="email"
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
            py: 1.2,
            fontWeight: "bold",
            borderRadius: 2,
            transition: "0.3s",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          Sign In
        </Button>
		  <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: "center", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Create an account <strong>Register</strong>
        </Typography>
      </Paper>
    </Box>
  );
}
