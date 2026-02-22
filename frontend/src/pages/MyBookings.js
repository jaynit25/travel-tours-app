import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Box, 
  CircularProgress, 
  Chip, 
  Button // Added this missing import
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    API.get("/mybookings")
      .then(res => setBookings(res.data))
      .catch(err => console.error("Error fetching bookings:", err))
      .finally(() => setLoading(false));
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'primary';
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress />
    </Box>
  );

  return (
    <Container sx={{ mt: 5, mb: 10 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", color: "#1a237e", textAlign: { xs: 'center', md: 'left' } }}>
        My Bookings
      </Typography>

      {bookings.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 10, p: 5, bgcolor: '#f5f5f5', borderRadius: 4 }}>
          <Typography variant="h6" color="text.secondary">You haven't booked any tours yet.</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')} 
            sx={{ mt: 2, bgcolor: "#1a237e" }}
          >
            Explore Tours
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map(b => (
            <Grid item xs={12} sm={6} md={4} key={b._id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  border: '1px solid #e0e0e0',
                  transition: '0.3s',
                  '&:hover': { boxShadow: '0px 10px 20px rgba(0,0,0,0.05)' }
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333", lineHeight: 1.2 }}>
                    {b.tour?.title || "Tour Plan"}
                  </Typography>
                  <Chip 
                    label={b.status} 
                    size="small" 
                    color={getStatusColor(b.status)} 
                    sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.65rem' }} 
                  />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                    📍 {b.tour?.location || "Location TBD"}
                  </Typography>
                  
                  <Box sx={{ bgcolor: '#f8f9fa', p: 1.5, borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <strong>Price:</strong> 
                      <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>₹{b.tour?.discountPrice || "0"}</span>
                    </Typography>
                    
                    {b.tour?.date && (
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <strong>Travel Date:</strong> {b.tour.date}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Typography variant="caption" sx={{ mt: 2, color: 'text.disabled', textAlign: 'right' }}>
                  ID: {b._id.slice(-6).toUpperCase()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}