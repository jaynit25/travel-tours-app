import { useParams, useNavigate, useLocation } from "react-router-dom"; // Add useNavigate and useLocation
import { useEffect, useState } from "react";
import API from "../api";
import { Container, Typography, Box, Button, CircularProgress } from "@mui/material";

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // To remember where the user came from
  const [tour, setTour] = useState(null);

  useEffect(() => {
    API.get(`/tours`)
      .then(res => {
        const found = res.data.find(t => t._id === id);
        setTour(found);
      });
  }, [id]);

  const bookTour = async () => {
    // 1. Check if token exists in localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      // 2. Redirect to login and save the current path in state
      alert("Please login to book this tour!");
      navigate("/login", { state: { from: location } });
      return;
    }

    try {
      await API.post("/book", { tourId: id });
      alert("Booking Successful!");
      navigate("/mybookings"); // Optional: Send them to their bookings page
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    }
  };

  if (!tour) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box
        component="img"
        src={tour.image ? `${process.env.REACT_APP_Image_BASE_URL}${tour.image}` : `${IMAGE_BASE}/uploads/default.jpg`}
        alt={tour.title}
        sx={{ width: "100%", height: 400, borderRadius: 2, objectFit: "cover" }}
      />

      <Typography variant="h4" sx={{ mt: 3, fontWeight: 'bold' }}>{tour.title}</Typography>
      <Typography variant="h6" color="text.secondary">{tour.location}</Typography>

      <Box sx={{ mt: 2, display: "flex", alignItems: 'center', gap: 2 }}>
        <Typography variant="body1" sx={{ textDecoration: "line-through", color: "gray" }}>
          ₹{tour.actualPrice}
        </Typography>
        <Typography variant="h4" color="error" fontWeight="bold">₹{tour.discountPrice}</Typography>
      </Box>

      <Typography sx={{ mt: 3, lineHeight: 1.7 }}>{tour.description}</Typography>

      <Button
        variant="contained"
        size="large"
        sx={{ mt: 4, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold' }}
        fullWidth
        onClick={bookTour}
      >
        Book Now
      </Button>
    </Container>
  );
}