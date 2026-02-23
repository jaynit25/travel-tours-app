import { Card, CardMedia, CardContent, Typography, Button, Box, Chip, Stack, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';

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
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 4,
        overflow: "hidden",
        position: 'relative',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        border: '1px solid #f0f0f0',
        boxShadow: "0px 4px 15px rgba(0,0,0,0.05)",
        "&:hover": { 
          boxShadow: "0px 15px 35px rgba(0,0,0,0.12)",
          transform: "translateY(-10px)",
          "& .tour-image": { transform: "scale(1.1)" }
        }
      }}
    >
      {/* Category Badge */}
      <Chip 
        label={tour.category} 
        size="small"
        sx={{ 
          position: 'absolute', top: 10, left: 15, zIndex: 1,
          bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 'bold', color: '#1a237e'
        }} 
      />

      <Box sx={{ height: 200, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          className="tour-image"
          sx={{ height: '100%', objectFit: "cover", transition: '0.6s' }}
          image={fullImageUrl}
          alt={tour.title}
          onError={(e) => { e.target.src = `${IMAGE_BASE}/uploads/default.jpg`; }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, color: '#ed8936' }}>
          <LocationOnIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
            {tour.location}
          </Typography>
        </Stack>

        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: "800", color: "#2d3748", mb: 2, minHeight: '3em',
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
          }}
        >
          {tour.title}
        </Typography>
        
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2, color: 'text.secondary' }}>
           <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{tour.days} Days</Typography>
           </Stack>
           <Stack direction="row" spacing={0.5} alignItems="center">
              <GroupsIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption">{tour.person} Person</Typography>
           </Stack>
        </Stack>

        <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />

        <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: "900", color: "#e53e3e" }}>
            ₹{tour.discountPrice}
          </Typography>
          <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
            ₹{tour.actualPrice}
          </Typography>
        </Box>
      </CardContent>

      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate(`/tours/${tour._id}`)} // Fixed route path
        sx={{ 
          borderRadius: 0, bgcolor: "#1a237e", py: 2, fontWeight: 'bold',
          "&:hover": { bgcolor: "#ed8936" } 
        }}
      >
        View Details
      </Button>
    </Card>
  );
}