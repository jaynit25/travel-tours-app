import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Typography } from "@mui/material";
import API from "../api";
import TourCard from "../components/TourCard"; // import your TourCard

import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function ToursCarousel() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    API.get("/tours").then(res => setTours(res.data));
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    responsive: [
      {
        breakpoint: 960,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: "auto", mt: 4 }}>
      <Typography variant="h4" mb={3} textAlign="center">
        Dham Yatra Group Tour Packages 2026
      </Typography>

      <Slider {...settings}>
        {tours.map(tour => (
          <Box key={tour._id} sx={{ px: 1 }}>
            <TourCard tour={tour} />
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
