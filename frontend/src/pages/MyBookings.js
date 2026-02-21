import { Container, Typography, Grid, Paper, Box } from "@mui/material";
import { useEffect, useState } from "react";
import API from "../api";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/mybookings")
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Typography sx={{ mt: 3 }}>Loading your bookings...</Typography>;
  if (bookings.length === 0) return <Typography sx={{ mt: 3 }}>You have no bookings yet.</Typography>;

  return (
    <Container sx={{ mt: 3, mb: 5 }}>
      <Typography variant="h4" mb={3} align="center">
        My Bookings
      </Typography>

      <Grid container spacing={2}>
        {bookings.map(b => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={b._id}>
            <Paper
              elevation={4}
              sx={{
                p: 2,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, fontWeight: "bold" }}>
                {b.tour.title}
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Location:</strong> {b.tour.location}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Price:</strong> ₹{b.tour.discountPrice}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Status:</strong> {b.status}
                </Typography>
                {b.tour.date && (
                  <Typography variant="body2">
                    <strong>Date:</strong> {b.tour.date}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
