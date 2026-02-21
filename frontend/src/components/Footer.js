import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, WhatsApp } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#1a237e", color: "white", py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Khodiyar Global Holidays Tours & Travels
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Your trusted partner for divine journeys and thrill-seeking adventures. 
              Specializing in Char Dham Yatra and weekend getaways.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} textAlign="center">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" underline="none" display="block">Home</Link>
            <Link href="/mybookings" color="inherit" underline="none" display="block">My Bookings</Link>
            <Link href="/profile" color="inherit" underline="none" display="block">Profile</Link>
          </Grid>
          <Grid item xs={12} md={4} textAlign="right">
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Connect With Us
            </Typography>
            <IconButton color="inherit"><Facebook /></IconButton>
            <IconButton color="inherit"><Instagram /></IconButton>
            <IconButton color="inherit"><Twitter /></IconButton>
            <IconButton color="inherit"><WhatsApp /></IconButton>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          © {new Date().getFullYear()} By Jaynit Nagar, Khodiyar Global Holidays Tours & Travels. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}