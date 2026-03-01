import React from "react";
import { Box, Container, Grid, Typography, Link, IconButton, Stack, Divider } from "@mui/material";
import { Facebook, Instagram, WhatsApp, Email, Phone, LocationOn } from "@mui/icons-material";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // Reusable Contact Item Component for cleaner code
  const ContactItem = ({ icon, text }) => (
    <Stack 
      direction="row" 
      spacing={1.5} 
      alignItems="flex-start" 
      sx={{ mb: 2, justifyContent: { xs: "center", md: "flex-start" } }}
    >
      {React.cloneElement(icon, { sx: { color: "#4fc3f7", fontSize: 20, mt: 0.3 } })}
      <Typography variant="body2" sx={{ lineHeight: 1.6, maxWidth: "250px" }}>
        {text}
      </Typography>
    </Stack>
  );

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: "#0a192f", // Slightly deeper, more modern navy
        color: "white", 
        pt: 8, 
        pb: 4, 
        mt: 8,
        borderTop: "4px solid #1a237e" 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          
          {/* Company Info */}
          <Grid item xs={12} md={4} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="h5" fontWeight="700" sx={{ mb: 2, letterSpacing: 1 }}>
              Khodiyar Global Holidays
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.8, mb: 3 }}>
              Your trusted partner for divine journeys and adventures. We specialize in 
              curating spiritual and leisure experiences that last a lifetime.
            </Typography>
            <Stack 
              direction="row" 
              spacing={1} 
              justifyContent={{ xs: "center", md: "flex-start" }}
            >
              {[
                { icon: <Facebook />, link: "#" },
                { icon: <Instagram />, link: "#" },
                { icon: <WhatsApp />, link: "https://wa.me/919825105889" }
              ].map((social, index) => (
                <IconButton 
                  key={index}
                  href={social.link}
                  sx={{ 
                    color: "white", 
                    bgcolor: "rgba(255,255,255,0.05)",
                    "&:hover": { bgcolor: "#1a237e", transform: "translateY(-3px)" },
                    transition: "all 0.3s"
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
              Quick Links
            </Typography>
            <Stack spacing={1.5}>
              {["Home"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  color="inherit"
                  underline="none"
                  sx={{ 
                    opacity: 0.8, 
                    fontSize: "0.9rem",
                    "&:hover": { opacity: 1, color: "#4fc3f7", pl: 1 },
                    transition: "all 0.2s"
                  }}
                >
                  {item}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={6} lg={4} textAlign={{ xs: "center", md: "left" }}>
            <Typography variant="h6" fontWeight="600" sx={{ mb: 3 }}>
              Contact Us
            </Typography>
            
            <ContactItem 
              icon={<LocationOn />} 
              text="71/558, Bombay Housing Board Near Ambaji Mata Temple, Hatkeshwar, Ahmedabad 380026, Gujarat, India" 
            />
            <ContactItem 
              icon={<Phone />} 
              text="+91 9825105889" 
            />
            <ContactItem 
              icon={<Email />} 
              text="booking@khodiyarglobalholidays.com" 
            />
          </Grid>

        </Grid>

        <Divider sx={{ mt: 6, mb: 4, borderColor: "rgba(255,255,255,0.1)" }} />

        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body2" sx={{ opacity: 0.5, textAlign: "center" }}>
            © {currentYear} Khodiyar Global Holidays. All rights reserved.
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.5, mt: { xs: 1, sm: 0 } }}>
            Designed by <Link href="#" color="inherit" underline="always">Jaynit Nagar</Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}