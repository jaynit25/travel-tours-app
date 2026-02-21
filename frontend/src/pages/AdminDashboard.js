import { Container, Typography, Grid, Box } from "@mui/material";
import { useEffect, useState } from "react";
import API from "../api";
import StatsCard from "../components/StatsCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ tours: 0, bookings: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      API.get("/admin/total-tours"),
      API.get("/admin/total-bookings"),
      API.get("/admin/total-users")
    ]).then(([tRes, bRes, uRes]) => {
      setStats({ tours: tRes.data.total, bookings: bRes.data.total, users: uRes.data.total });
    });
  }, []);

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" mb={3}>Admin Dashboard</Typography>

      <Grid container spacing={2}>
        {/** Wrap each card in Box for consistent padding */}
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ p: 1 }}>
            <StatsCard title="Total Tours" value={stats.tours} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ p: 1 }}>
            <StatsCard title="Total Bookings" value={stats.bookings} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box sx={{ p: 1 }}>
            <StatsCard title="Total Users" value={stats.users} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
