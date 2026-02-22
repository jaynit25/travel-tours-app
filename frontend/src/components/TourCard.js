import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TourCard({ tour }) {
  const navigate = useNavigate();
  // Use the Image Base URL specifically for the media
  const IMAGE_BASE = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";

  // Fix backslashes from Windows DB and ensure leading slash
  const cleanImagePath = tour.image?.replace(/\\/g, '/');
  const fullImageUrl = tour.image 
    ? `${IMAGE_BASE}${cleanImagePath.startsWith('/') ? '' : '/'}${cleanImagePath}`
    : `${IMAGE_BASE}/uploads/default.jpg`;

  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: 2,
        borderRadius: 2,
        overflow: "hidden",
        transition: "transform 0.3s ease",
        "&:hover": { transform: { xs: "none", md: "scale(1.03)" }, boxShadow: 6 }
      }}
    >
      <CardMedia
        component="img"
        sx={{ 
          height: { xs: 160, md: 200 }, 
          objectFit: "cover" 
        }}
        image={fullImageUrl}
        alt={tour.title}
        onError={(e) => { e.target.src = `${IMAGE_BASE}/uploads/default.jpg`; }}
      />
      <CardContent sx={{ flexGrow: 1, p: { xs: 1.5, md: 2 } }}>
        <Typography 
          variant="h6" 
          sx={{ fontSize: { xs: "1rem", md: "1.25rem" }, fontWeight: "bold", mb: 0.5 }}
        >
          {tour.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {tour.location}
        </Typography>
        <Box sx={{ mt: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6" color="error" sx={{ fontWeight: "700" }}>
            ₹{tour.discountPrice}
          </Typography>
          <Typography variant="caption" sx={{ textDecoration: "line-through", color: "gray" }}>
            ₹{tour.actualPrice}
          </Typography>
        </Box>
      </CardContent>
      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate(`/tour/${tour._id}`)}
        sx={{ 
          mt: "auto", 
          borderRadius: 0, 
          bgcolor: "#1a237e", 
          py: 1.2,
          "&:hover": { bgcolor: "#0d1440" } 
        }}
      >
        View Details
      </Button>
    </Card>
  );
}