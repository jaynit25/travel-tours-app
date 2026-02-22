import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, WhatsApp } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#1a237e", color: "white", py: 6, mt: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="h6" fontWeight="bold">Khodiyar Global Holidays</Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>Your trusted partner for divine journeys and adventures.</Typography>
          </Grid>
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h6" fontWeight="bold">Quick Links</Typography>
            <Box sx={{ mt: 1 }}>
              <Link href="/" color="inherit" sx={{ display: "block", mb: 0.5 }}>Home</Link>
              <Link href="/mybookings" color="inherit" sx={{ display: "block" }}>Bookings</Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} textAlign={{ xs: "center", md: "right" }}>
            <Typography variant="h6" fontWeight="bold">Follow Us</Typography>
            <IconButton color="inherit"><Facebook /></IconButton>
            <IconButton color="inherit"><Instagram /></IconButton>
            <IconButton color="inherit"><WhatsApp /></IconButton>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          © {new Date().getFullYear()} Khodiyar Global Holidays. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}