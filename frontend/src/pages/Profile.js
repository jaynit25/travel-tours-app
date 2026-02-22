import { Container, Typography, TextField, Button, Paper, Box, Alert, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", mobile: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    API.get("/profile")
      .then(res => setProfile({ ...res.data, password: "" })) // don't prefill password
      .catch(err => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Simple validation
  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!profile.name.trim()) return "Name is required";
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
      if (!updateData.password) delete updateData.password; // don't send empty password

      updateData.mobile = updateData.mobile.replace(/\D/g, "").slice(0, 10);
      if (!updateData.password) delete updateData.password; // don’t send empty password
      
      await API.put("/profile", updateData);

      setSuccess("Profile updated successfully!");
      setProfile(prev => ({ ...prev, password: "" })); // reset password field
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      <CircularProgress />
      <Typography mt={2}>Loading profile...</Typography>
    </Container>
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" mb={3} align="center">
          My Profile
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Name"
            fullWidth
            sx={{ mb: 2 }}
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
          />

          <TextField
            label="Email"
            fullWidth
            sx={{ mb: 2 }}
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
          />

          <TextField
            label="Mobile"
            fullWidth
            sx={{ mb: 2 }}
            value={profile.mobile}
            onChange={e => setProfile({ ...profile, mobile: e.target.value })}
            placeholder="10-digit mobile number"
          />

          <TextField
            label="New Password"
            type="password"
            fullWidth
            sx={{ mb: 3 }}
            placeholder="Leave empty to keep current password"
            value={profile.password}
            onChange={e => setProfile({ ...profile, password: e.target.value })}
          />

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={saveProfile}
            sx={{ py: 1.5 }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}