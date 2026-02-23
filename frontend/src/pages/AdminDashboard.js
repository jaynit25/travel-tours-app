import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Box, Paper, Stack } from "@mui/material";
import API from "../api";
import StatsCard from "../components/StatsCard";
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ tours: 0, bookings: 0, users: 0 });

  useEffect(() => {
    Promise.all([
      API.get("/admin/total-tours"),
      API.get("/admin/total-bookings"),
      API.get("/admin/total-users")
    ]).then(([tRes, bRes, uRes]) => {
      setStats({ 
        tours: tRes.data.total, 
        bookings: bRes.data.total, 
        users: uRes.data.total 
      });
    }).catch(err => console.error("Dashboard Stats Error:", err));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="900" sx={{ color: '#2d3748' }}>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, Admin. Here is what's happening with Khodiyar Global today.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard 
            title="Active Tours" 
            value={stats.tours} 
            icon={<TravelExploreIcon sx={{ fontSize: 40 }} />}
            color="#3182ce" // Blue
            trend="+2 this week"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard 
            title="Total Bookings" 
            value={stats.bookings} 
            icon={<ConfirmationNumberIcon sx={{ fontSize: 40 }} />}
            color="#38a169" // Green
            trend="+12% growth"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <StatsCard 
            title="Registered Users" 
            value={stats.users} 
            icon={<PeopleAltIcon sx={{ fontSize: 40 }} />}
            color="#805ad5" // Purple
            trend="New users today"
          />
        </Grid>

        {/* Optional: Visual Dashboard Filler */}
        <Grid item xs={12}>
          <Paper sx={{ 
            p: 4, 
            borderRadius: 4, 
            background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">Ready to launch a new tour?</Typography>
              <Typography sx={{ opacity: 0.8 }}>Update your packages to attract more travelers.</Typography>
            </Box>
            <TrendingUpIcon sx={{ fontSize: 60, opacity: 0.2 }} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}