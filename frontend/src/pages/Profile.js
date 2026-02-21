import { Container, Typography, TextField, Button, Paper, Box } from "@mui/material";
import { useEffect, useState } from "react";
import API from "../api";

export default function Profile() {
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/profile")
      .then(res => setProfile({ ...res.data, password: "" })) // leave password empty
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async () => {
    try {
      const updateData = { ...profile };
      if (!updateData.password) delete updateData.password; // don’t send empty password

      await API.put("/profile", updateData);
      alert("Profile updated successfully!");
      setProfile(prev => ({ ...prev, password: "" })); // reset password field
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" mb={3} align="center">
          My Profile
        </Typography>

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
          >
            Save
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
