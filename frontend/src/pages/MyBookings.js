import React, { useEffect, useState } from "react";
import { 
  Container, Typography, Grid, Paper, Box, CircularProgress, 
  Chip, Button, Stack, TablePagination, Divider 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const navigate = useNavigate();

  // Handle both Local and Cloudinary images
  const IMAGE_BASE = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";

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

  const getFullImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x200?text=No+Image";
    // Check if it's a Cloudinary link (starts with http) or a local path
    return img.startsWith('http') ? img : `${IMAGE_BASE}${img}`;
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return { color: 'success', label: 'Confirmed' };
      case 'pending': return { color: 'warning', label: 'Pending' };
      case 'cancelled': return { color: 'error', label: 'Cancelled' };
      default: return { color: 'primary', label: status || 'Processing' };
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CircularProgress sx={{ color: '#ed8936' }} />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 10 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, textAlign: { xs: 'center', md: 'left' } }}>
        <Typography variant="h3" sx={{ fontWeight: 900, color: "#1a237e", mb: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
          Your Adventures
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
          Manage your upcoming trips and travel history.
        </Typography>
      </Box>

      {bookings.length === 0 ? (
        <Paper sx={{ textAlign: 'center', py: 10, px: 2, borderRadius: 5, bgcolor: '#f8fafc', border: '2px dashed #e2e8f0' }} elevation={0}>
          <Typography variant="h5" color="text.primary" fontWeight="bold">No bookings found</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')} 
            sx={{ mt: 3, bgcolor: "#ed8936", borderRadius: 2, fontWeight: 'bold' }}
          >
            Start Exploring
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={3}>
            {bookings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(b => {
                const statusInfo = getStatusColor(b.status);
                return (
                  <Grid item xs={12} sm={6} md={4} key={b._id}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 4,
                        overflow: 'hidden',
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        border: '1px solid #edf2f7',
                        transition: '0.3s cubic-bezier(.4,0,.2,1)',
                        '&:hover': { 
                          transform: 'translateY(-8px)', 
                          boxShadow: '0px 20px 40px rgba(0,0,0,0.08)' 
                        }
                      }}
                    >
                      {/* Image Section */}
                      <Box sx={{ position: 'relative', height: 200 }}>
                        <Box 
                          component="img"
                          src={getFullImageUrl(b.tour?.image)}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Chip 
                          label={statusInfo.label} 
                          color={statusInfo.color}
                          size="small"
                          sx={{ 
                            position: 'absolute', top: 12, right: 12, 
                            fontWeight: 'bold', px: 1 
                          }} 
                        />
                      </Box>

                      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#2d3748", mb: 1.5, height: '3.2em', overflow: 'hidden' }}>
                          {b.tour?.title}
                        </Typography>
                        
                        <Stack spacing={1} sx={{ mb: 2 }}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOnIcon fontSize="small" sx={{ color: '#ed8936' }} />
                            <Typography variant="body2" color="text.secondary">{b.tour?.location}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CalendarMonthIcon fontSize="small" sx={{ color: '#ed8936' }} />
                            <Typography variant="body2" color="text.secondary">
                                {new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </Typography>
                          </Stack>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Box>
                              <Typography variant="caption" color="text.disabled" fontWeight="700">PAID AMOUNT</Typography>
                              <Typography variant="h6" sx={{ color: '#e53e3e', fontWeight: 900 }}>₹{b.tour?.discountPrice}</Typography>
                            </Box>
                            <Chip 
                                label={`#${b._id.slice(-6).toUpperCase()}`} 
                                size="small" 
                                variant="outlined" 
                                sx={{ fontFamily: 'monospace', borderRadius: 1 }}
                            />
                        </Stack>

                        <Button 
                          fullWidth 
                          variant="contained" 
                          startIcon={<InfoOutlinedIcon />}
                          onClick={() => navigate(`/tours/${b.tour?._id}`)}
                          sx={{ 
                            borderRadius: 2, 
                            textTransform: 'none', 
                            fontWeight: 'bold',
                            bgcolor: '#1a237e',
                            "&:hover": { bgcolor: '#ed8936' }
                          }}
                        >
                          View Tour Details
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
          </Grid>

          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
            <TablePagination
              component="div"
              count={bookings.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 12]}
            />
          </Box>
        </>
      )}
    </Container>
  );
}