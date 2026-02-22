import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter, WhatsApp, Email, Phone, LocationOn } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#1a237e", color: "white", py: 6, mt: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          
          {/* Company Info */}
          <Grid item xs={12} md={3} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="h6" fontWeight="bold">
              Khodiyar Global Holidays
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              Your trusted partner for divine journeys and adventures.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={3} textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              Quick Links
            </Typography>
            <Box sx={{ mt: 1 }}>
              <Link href="/" color="inherit" sx={{ display: "block", mb: 0.5 }}>
                Home
              </Link>
              <Link href="/mybookings" color="inherit" sx={{ display: "block" }}>
                Bookings
              </Link>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="h6" fontWeight="bold">
              Contact Us
            </Typography>

            <Box sx={{ mt: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
                <LocationOn sx={{ mr: 1 }} fontSize="small" />
                <Typography variant="body2">
                  Ahmedabad, Gujarat, India
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 1, justifyContent: { xs: "center", md: "flex-start" } }}>
                <Phone sx={{ mr: 1 }} fontSize="small" />
                <Typography variant="body2">
                  +91 9712369327
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", justifyContent: { xs: "center", md: "flex-start" } }}>
                <Email sx={{ mr: 1 }} fontSize="small" />
                <Typography variant="body2">
                  info@khodiyarglobalholidays.com
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={3} textAlign={{ xs: "center", md: "right" }}>
            <Typography variant="h6" fontWeight="bold">
              Follow Us
            </Typography>
            <IconButton color="inherit">
              <Facebook />
            </IconButton>
            <IconButton color="inherit">
              <Instagram />
            </IconButton>
            <IconButton color="inherit">
              <WhatsApp />
            </IconButton>
          </Grid>

        </Grid>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, pt: 2, borderTop: "1px solid rgba(255,255,255,0.1)" }}
        >
          © {new Date().getFullYear()} By Jaynit Nagar, Khodiyar Global Holidays. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}