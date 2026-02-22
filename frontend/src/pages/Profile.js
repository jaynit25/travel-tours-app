import { Container, Typography, TextField, Button, Paper, Box, Alert, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for auth check
import API from "../api";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "", mobile: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // 1. Auth Guard
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/profile")
      .then(res => setProfile({ ...res.data, password: "" })) 
      .catch(err => setError("Failed to load profile. Please log in again."))
      .finally(() => setLoading(false));
  }, [navigate]);

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!profile.name?.trim()) return "Name is required";
    if (!emailRegex.test(profile.email)) return "Enter a valid email";
    if (!mobileRegex.test(profile.mobile)) return "Enter a valid 10-digit mobile number";
    if (profile.password && profile.password.length < 6) return "Password must be at least 6 characters";

    return null;
  };

  const saveProfile = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updateData = { ...profile };
      // Standardize mobile number format
      updateData.mobile = updateData.mobile.toString().replace(/\D/g, "").slice(0, 10);
      
      // Don't send empty password to backend
      if (!updateData.password) delete updateData.password; 
      
      await API.put("/profile", updateData);

      setSuccess("Profile updated successfully!");
      setProfile(prev => ({ ...prev, password: "" })); 
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
      <Typography mt={2} color="text.secondary">Loading your profile...</Typography>
    </Box>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}>
      <Paper elevation={0} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <Typography variant="h4" mb={1} align="center" sx={{ fontWeight: 'bold', color: '#1a237e' }}>
          My Profile
        </Typography>
        <Typography variant="body2" mb={4} align="center" color="text.secondary">
          Manage your personal details and account security
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>{success}</Alert>}

        <Box component="form" noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <TextField
            label="Full Name"
            fullWidth
            variant="outlined"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
          />

          <TextField
            label="Email Address"
            fullWidth
            variant="outlined"
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
          />

          <TextField
            label="Mobile Number"
            fullWidth
            variant="outlined"
            value={profile.mobile}
            onChange={e => setProfile({ ...profile, mobile: e.target.value })}
            placeholder="10-digit mobile number"
          />

          <TextField
            label="Update Password"
            type="password"
            fullWidth
            variant="outlined"
            placeholder="Leave blank to keep current password"
            value={profile.password}
            onChange={e => setProfile({ ...profile, password: e.target.value })}
            helperText="At least 6 characters if changing"
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={saveProfile}
            sx={{ 
              py: 1.8, 
              mt: 1, 
              bgcolor: "#1a237e", 
              fontWeight: 'bold',
              borderRadius: 2,
              boxShadow: 'none',
              "&:hover": { bgcolor: "#0d1440", boxShadow: '0px 4px 10px rgba(0,0,0,0.2)' }
            }}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Update Profile"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}