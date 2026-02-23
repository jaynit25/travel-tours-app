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
  const [rowsPerPage, setRowsPerPage] = useState(6); // Show 6 cards per page
  const navigate = useNavigate();
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
      default: return { color: 'primary', label: status };
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
        <Typography variant="h3" sx={{ fontWeight: 900, color: "#2d3748", mb: 1 }}>
          Your Adventures
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your upcoming trips and travel history with Khodiyar Global.
        </Typography>
      </Box>

      {bookings.length === 0 ? (
        <Paper sx={{ textAlign: 'center', py: 10, px: 2, borderRadius: 5, bgcolor: '#f8fafc', border: '2px dashed #e2e8f0' }} elevation={0}>
          <Typography variant="h5" color="text.primary" fontWeight="bold">No bookings found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4 }}>Time to pack your bags and explore the world!</Typography>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')} 
            sx={{ bgcolor: "#ed8936", px: 4, py: 1.5, borderRadius: 3, fontWeight: 'bold', "&:hover": { bgcolor: "#dd6b20" } }}
          >
            Explore Tours
          </Button>
        </Paper>
      ) : (
        <>
          <Grid container spacing={4}>
            {bookings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(b => {
                const statusInfo = getStatusColor(b.status);
                return (
                  <Grid item xs={12} sm={6} md={4} key={b._id}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 5,
                        overflow: 'hidden',
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        border: '1px solid #edf2f7',
                        transition: '0.4s',
                        '&:hover': { 
                          transform: 'translateY(-10px)', 
                          boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px rgba(0,0,0,0.04)' 
                        }
                      }}
                    >
                      {/* Tour Image Section */}
                      <Box sx={{ position: 'relative', height: 180 }}>
                        <Box 
                          component="img"
                          src={b.tour?.image ? `${IMAGE_BASE}${b.tour.image}` : "https://via.placeholder.com/400x200?text=Tour+Image"}
                          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <Chip 
                          label={statusInfo.label} 
                          color={statusInfo.color}
                          sx={{ 
                            position: 'absolute', top: 15, right: 15, 
                            fontWeight: 'bold', backdropFilter: 'blur(4px)', 
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
                          }} 
                        />
                      </Box>

                      <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "#2d3748", mb: 2, minHeight: '3.6em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {b.tour?.title || "Boutique Tour Package"}
                        </Typography>
                        
                        <Stack spacing={1.5} sx={{ mb: 3 }}>
                          <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                            <LocationOnIcon fontSize="small" sx={{ color: '#ed8936' }} />
                            <Typography variant="body2">{b.tour?.location || "Destination TBD"}</Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                            <CalendarMonthIcon fontSize="small" sx={{ color: '#ed8936' }} />
                            <Typography variant="body2">{b.tour?.date || "Date to be announced"}</Typography>
                          </Stack>
                        </Stack>

                        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                           <Box>
                              <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>Total Paid</Typography>
                              <Typography variant="h6" sx={{ color: '#2d3748', fontWeight: 900 }}>₹{b.tour?.discountPrice || "0"}</Typography>
                           </Box>
                           <Typography variant="caption" sx={{ p: 0.5, px: 1, bgcolor: '#f7fafc', borderRadius: 1, color: 'text.disabled', fontFamily: 'monospace' }}>
                             #{b._id.slice(-6).toUpperCase()}
                           </Typography>
                        </Stack>

                        <Button 
                          fullWidth 
                          variant="outlined" 
                          startIcon={<InfoOutlinedIcon />}
                          onClick={() => navigate(`/tours/${b.tour?._id}`)}
                          disabled={!b.tour?._id}
                          sx={{ 
                            borderRadius: 3, 
                            textTransform: 'none', 
                            fontWeight: 'bold',
                            borderColor: '#e2e8f0',
                            color: '#4a5568',
                            "&:hover": { borderColor: '#ed8936', color: '#ed8936', bgcolor: '#fffaf0' }
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

          <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
            <TablePagination
              component="div"
              count={bookings.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[6, 12, 24]}
              sx={{
                bgcolor: '#f8fafc',
                borderRadius: 4,
                px: 2,
                border: '1px solid #edf2f7'
              }}
            />
          </Box>
        </>
      )}
    </Container>
  );
}