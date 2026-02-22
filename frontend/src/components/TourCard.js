import { Card, CardMedia, CardContent, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TourCard({ tour }) {
  const navigate = useNavigate();
  const IMAGE_BASE = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";

  const cleanImagePath = tour.image?.replace(/\\/g, '/');
  const fullImageUrl = tour.image 
    ? `${IMAGE_BASE}${cleanImagePath.startsWith('/') ? '' : '/'}${cleanImagePath}`
    : `${IMAGE_BASE}/uploads/default.jpg`;

  return (
    <Card
      sx={{
        height: "100%", // Fills the grid item height
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
        borderRadius: 2,
        overflow: "hidden",
        "&:hover": { boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }
      }}
    >
      <CardMedia
        component="img"
        sx={{ height: 200, objectFit: "cover" }}
        image={fullImageUrl}
        alt={tour.title}
        onError={(e) => { e.target.src = `${IMAGE_BASE}/uploads/default.jpg`; }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "bold", 
            color: "#333", 
            fontSize: "1.1rem",
            mb: 1,
            lineHeight: 1.2,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden"
          }}
        >
          {tour.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          📍 {tour.location}
        </Typography>
        
        <Box sx={{ mt: 'auto', display: "flex", alignItems: "center", gap: 1 }}>
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
        sx={{ borderRadius: 0, bgcolor: "#1a237e", py: 1.5, "&:hover": { bgcolor: "#0d1440" } }}
      >
        View Details
      </Button>
    </Card>
  );
}