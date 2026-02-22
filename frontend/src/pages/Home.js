import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Button, CircularProgress, Grid } from "@mui/material";
import API from "../api";
import TourCard from "../components/TourCard";
import Footer from "../components/Footer";
import Maintenance from "../pages/Maintenance";

export default function Home() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverDown, setServerDown] = useState(false);
  const IMAGE_BASE = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    setLoading(true);
    API.get("/tours")
      .then((res) => {
        setTours(res.data);
        setLoading(false);
        setServerDown(false);
      })
      .catch((err) => {
        console.error("Critical Data Load Failed:", err);
        setLoading(false);
        if (tours.length === 0) setServerDown(true);
      });
  }, []);

  const categories = [
    { title: "Char Dham Yatra Packages", key: "char_dham" },
    { title: "Amazing Weekend Getaways", key: "weekend" },
    { title: "Top Trending Trips", key: "trending" },
    { title: "Exclusive Offers", key: "exclusive" },
  ];

  if (serverDown) return <Maintenance />;

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          height: { xs: "60vh", md: "80vh" },
          display: "flex",
          alignItems: "center",
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.4)), url('${IMAGE_BASE}/uploads/loginbg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 700, textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.3rem", md: "3.5rem" }, fontWeight: "900", mb: 2 }}>
              Khodiyar Global Holidays
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontSize: { xs: "1.1rem", md: "1.5rem" } }}>
              Explore divine journeys and world-class adventures.
            </Typography>
            <Button variant="contained" size="large" sx={{ bgcolor: "#ff9800", borderRadius: "50px", px: 5 }}>
              Book Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#1a237e' }} />
          </Box>
        ) : (
          categories.map((cat) => {
            const filteredTours = tours.filter((t) => t.category === cat.key);
            if (filteredTours.length === 0) return null;
            return (
              <Box key={cat.key} sx={{ mb: { xs: 6, md: 8 } }}>
                <Typography variant="h4" sx={{ 
                  mb: 4, 
                  fontWeight: "800", 
                  color: "#1a237e", 
                  textAlign: { xs: 'center', md: 'left' },
                  fontSize: { xs: "1.6rem", md: "2.2rem" }
                }}>
                  {cat.title}
                </Typography>
                
                {/* Replaced Slider with Grid */}
                <Grid container spacing={3}>
                  {filteredTours.map((tour) => (
                    <Grid item key={tour._id} xs={12} sm={6} md={4}>
                      <TourCard tour={tour} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            );
          })
        )}
      </Container>
      <Footer />
    </Box>
  );
}