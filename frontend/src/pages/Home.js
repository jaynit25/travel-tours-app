import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  useTheme, 
  alpha 
} from "@mui/material";
import Slider from "react-slick";
import API from "../api";
import TourCard from "../components/TourCard";
import Footer from "../components/Footer";

// Carousel CSS
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [tours, setTours] = useState([]);
  const theme = useTheme();
  const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    API.get("/tours").then((res) => setTours(res.data));
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: tours.length > 3,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1, dots: false } },
    ],
  };

  const categories = [
    { title: "Char Dham Yatra Packages", key: "char_dham" },
    { title: "Amazing Weekend Getaways", key: "weekend" },
    { title: "Top Trending Trips", key: "trending" },
    { title: "Exclusive Offers", key: "exclusive" },
  ];

  return (
    <Box sx={{ bgcolor: "#f9f9f9", minHeight: "100vh" }}>
      
      {/* --- REFINED HERO SECTION --- */}
      <Box
        sx={{
          height: { xs: "60vh", md: "80vh" },
          display: "flex",
          alignItems: "center",
          position: "relative",
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.8), rgba(0,0,0,0.2)), url('${API_BASE_URL}/uploads/loginbg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 600 }}>
            <Typography 
              variant="h2" 
              fontWeight="600" 
              sx={{ 
                fontSize: { xs: "2.5rem", md: "4rem" },
                lineHeight: 1.2,
                mb: 2 
              }}
            >
              Khodiyar Global Holidays Tours & Travels
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ mb: 4, fontWeight: 300, opacity: 0.9 }}
            >
              Explore the divine journeys with Us. 
              Your adventure starts here.
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: "#ff9800", 
                color: "white",
                px: 4, py: 1.5, 
                borderRadius: "50px",
                fontSize: "1.1rem",
                "&:hover": { bgcolor: "#e68a00" }
              }}
            >
              Book Your Trip
            </Button>
          </Box>
        </Container>
      </Box>

      {/* --- DYNAMIC CATEGORY SECTIONS --- */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        {categories.map((cat) => {
          const filteredTours = tours.filter((t) => t.category === cat.key);
          if (filteredTours.length === 0) return null;

          return (
            <Box key={cat.key} sx={{ mt: 8 }}>
              <Box 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  mb: 4,
                  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  pb: 1
                }}
              >
                <Typography 
                  variant="h4" 
                  fontWeight="700"
                  sx={{ color: theme.palette.primary.main }}
                >
                  {cat.title}
                </Typography>
                <Button color="primary" sx={{ fontWeight: "bold" }}>View All</Button>
              </Box>

              <Slider {...sliderSettings}>
                {filteredTours.map((tour) => (
                  <Box key={tour._id} sx={{ px: 1.5, pb: 4 }}>
                    <TourCard tour={tour} />
                  </Box>
                ))}
              </Slider>
            </Box>
          );
        })}
      </Container>

      <Footer />
    </Box>
  );
}