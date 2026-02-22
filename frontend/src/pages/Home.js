import React, { useEffect, useState } from "react";
import { Box, Typography, Container, Button, useTheme, alpha } from "@mui/material";
import Slider from "react-slick";
import API from "../api";
import TourCard from "../components/TourCard";
import Footer from "../components/Footer";
import Maintenance from "../pages/Maintenance";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const [tours, setTours] = useState([]);
  const [serverDown, setServerDown] = useState(false);
  const theme = useTheme();
  const IMAGE_BASE = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    API.get("/tours")
      .then((res) => {
        setTours(res.data);
        setServerDown(false); // Reset if it was down before
      })
      .catch((err) => {
        console.error("Critical Data Load Failed:", err);
        // Only trigger maintenance if we have NO data to show
        if (tours.length === 0) {
          setServerDown(true);
        }
      });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: tours.length > 3,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { 
        breakpoint: 600, 
        settings: { 
          slidesToShow: 1, 
          arrows: false, 
          centerMode: true, 
          centerPadding: '20px' 
        } 
      },
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
      <Box
        sx={{
          height: { xs: "50vh", md: "80vh" },
          display: "flex",
          alignItems: "center",
          position: "relative",
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.3)), url('${IMAGE_BASE}/uploads/loginbg.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 700 }}>
            <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "3.5rem" }, fontWeight: "bold", mb: 2 }}>
              Khodiyar Global Holidays
            </Typography>
            <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontSize: { xs: "1rem", md: "1.5rem" } }}>
              Explore divine journeys and world-class adventures.
            </Typography>
            <Button variant="contained" size="large" sx={{ bgcolor: "#ff9800", borderRadius: "50px", px: 4 }}>
              Book Now
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {categories.map((cat) => {
          const filteredTours = tours.filter((t) => t.category === cat.key);
          if (filteredTours.length === 0) return null;
          return (
            <Box key={cat.key} sx={{ mb: 8 }}>
              <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#1a237e", textAlign: { xs: 'center', md: 'left' } }}>
                {cat.title}
              </Typography>
              <Slider {...sliderSettings}>
                {filteredTours.map((tour) => (
                  <Box key={tour._id} sx={{ px: 1, pb: 4 }}>
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