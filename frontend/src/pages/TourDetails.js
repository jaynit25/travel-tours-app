import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";
// Added Stack to the imports below
import { 
  Container, Typography, Box, Button, CircularProgress, 
  Grid, Paper, Divider, Chip, Stack 
} from "@mui/material";
import ReviewSection from "../components/Reviews/ReviewSection";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';
import { Helmet } from "react-helmet";

export default function TourDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const IMAGE_BASE = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";

 useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch Tour Details
        const tourRes = await API.get(`/tours`);
        const found = tourRes.data.find(t => t._id === id);
        setTour(found);

        // 2. Check if user has already booked this (only if logged in)
        const token = localStorage.getItem("token");
        if (token) {
          const bookingsRes = await API.get("/mybookings");
          const alreadyBooked = bookingsRes.data.some(b => b.tour?._id === id);
          setIsAlreadyBooked(alreadyBooked);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const bookTour = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to book this tour!");
      navigate("/login", { state: { from: location } });
      return;
    }
    setBookingLoading(true);
    try {
      await API.post("/book", { tourId: id });
      alert("Booking Successful!");
      navigate("/mybookings");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
    setBookingLoading(false); // End loading
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress sx={{ color: '#ed8936' }} />
    </Box>
  );

  if (!tour) return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <Typography variant="h5">Tour not found or has been removed.</Typography>
      <Button onClick={() => navigate('/')} sx={{ mt: 2 }}>Back to Home</Button>
    </Container>
  );

const fullImageUrl = tour.image?.startsWith('http') 
  ? tour.image 
  : `${IMAGE_BASE}${tour.image}`;

  const currentUrl = window.location.href;
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
    {/* SEO META TAGS */}
      {tour && (
        <Helmet>
          <title>{tour.title} | Khodiyar Global Holidays</title>
          <meta name="description" content={tour.description?.substring(0, 160)} />
          <meta name="keywords" content={`${tour.location}, ${tour.category}, travel deals, divine journeys`} />

          {/* Facebook / WhatsApp / LinkedIn (Open Graph) */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={currentUrl} />
          <meta property="og:title" content={`${tour.title} - ${tour.location}`} />
          <meta property="og:description" content={`Book your ${tour.days}-day adventure to ${tour.location} for only ₹${tour.discountPrice}!`} />
          <meta property="og:image" content={fullImageUrl} />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={tour.title} />
          <meta name="twitter:description" content={tour.description?.substring(0, 160)} />
          <meta name="twitter:image" content={fullImageUrl} />
        </Helmet>
      )}
      <Grid container spacing={5}>
        {/* Left Side: Image Section */}
        <Grid item xs={12} md={7}>
          {tour.image ? (
            <Box
              component="img"
              src={fullImageUrl}
              alt={tour.title}
              sx={{ 
                width: "100%", height: { xs: 300, md: 500 }, 
                borderRadius: 6, objectFit: "cover", 
                boxShadow: '0 15px 35px rgba(0,0,0,0.1)' 
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <Box sx={{ 
              width: "100%", height: { xs: 300, md: 500 }, borderRadius: 6, 
              bgcolor: '#f7fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>
              <Typography color="text.disabled">No Image Available</Typography>
            </Box>
          )}
        </Grid>

        {/* Right Side: Booking Card */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 4, borderRadius: 6, border: '1px solid #f0f0f0', bgcolor: '#ffffff' }}>
            <Chip 
              label={tour.category?.toUpperCase() || "TOUR"} 
              sx={{ mb: 2, fontWeight: 'bold', bgcolor: '#fffaf0', color: '#ed8936' }} 
            />
            <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 900, 
                  color: "#2d3748", 
                  mb: 2,
                  // Add these lines below:
                  lineHeight: 1.2,
                  wordBreak: "break-word", // Ensures long words wrap to the next line
                  overflowWrap: "break-word", 
                  display: "-webkit-box",
                  WebkitLineClamp: 3, // Optional: Limits the title to 3 lines if it's ridiculously long
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden"
                }}
              >
                {tour.title}
              </Typography>
            
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3, color: 'text.secondary' }}>
              <LocationOnIcon sx={{ color: '#ed8936' }} />
              <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{tour.location}</Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 4 }}>
               <Typography variant="body2" color="text.secondary">Price per person</Typography>
               <Stack direction="row" spacing={2} alignItems="baseline">
                  <Typography variant="h3" sx={{ color: '#e53e3e', fontWeight: "900" }}>₹{tour.discountPrice}</Typography>
                  <Typography variant="h6" sx={{ textDecoration: "line-through", color: "text.disabled" }}>₹{tour.actualPrice}</Typography>
               </Stack>
            </Box>

            {/* Tour Meta Info */}
            <Stack direction="row" spacing={4} sx={{ mb: 4 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <CalendarTodayIcon color="action" />
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">Duration</Typography>
                  <Typography variant="body2" fontWeight="bold">{tour.days} Days</Typography>
                </Box>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <GroupsIcon color="action" />
                <Box>
                  <Typography variant="caption" display="block" color="text.secondary">Group Size</Typography>
                  <Typography variant="body2" fontWeight="bold">{tour.person} Persons</Typography>
                </Box>
              </Stack>
            </Stack>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={bookTour}
              disabled={isAlreadyBooked} // Disable if already booked
              sx={{ 
                py: 2, 
                borderRadius: 4, 
                bgcolor: isAlreadyBooked ? '#ccc' : '#1a237e',
                '&:hover': { bgcolor: isAlreadyBooked ? '#ccc' : '#ed8936' }
              }}
            >
              {bookingLoading ? <CircularProgress size={24} color="inherit" /> : (isAlreadyBooked ? "Already Booked" : "Confirm Booking")}
            </Button>
          </Paper>
        </Grid>

        {/* Bottom Section: Description */}
        <Grid item xs={12}>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: '#2d3748' }}>
              Overview
            </Typography>
            <Typography variant="body1" sx={{ color: '#4a5568', lineHeight: 1.8, fontSize: '1.1rem', whiteSpace: 'pre-line' }}>
              {tour.description}
            </Typography>
          </Box>
          
          <Box sx={{ mt: 8 }}>
            <ReviewSection tourId={id} isLoggedIn={!!localStorage.getItem("token")} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
