import { Card, CardMedia, CardContent, Typography, Button, Box, Chip, Stack, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import GroupsIcon from '@mui/icons-material/Groups';

export default function TourCard({ tour }) {
  const navigate = useNavigate();
  const IMAGE_BASE = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";

  const fullImageUrl = tour.image?.startsWith('http') 
    ? tour.image 
    : `${IMAGE_BASE}${tour.image}`;

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3, // Slightly smoother corners
        overflow: "hidden",
        position: 'relative',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid #eee',
        boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
        "&:hover": { 
          boxShadow: "0px 12px 24px rgba(0,0,0,0.1)",
          transform: "translateY(-5px)",
          "& .tour-image": { transform: "scale(1.08)" }
        }
      }}
    >
      {/* Category Badge - More Professional Padding */}
      <Chip 
        label={tour.category?.replace('_', ' ')} 
        size="small"
        sx={{ 
          position: 'absolute', top: 12, left: 12, zIndex: 1,
          bgcolor: 'rgba(26, 35, 126, 0.85)', // Dark blue with transparency
          color: '#fff', fontWeight: '600', textTransform: 'uppercase', fontSize: '0.65rem'
        }} 
      />

      {/* Reduced Image Height (160px instead of 200px) */}
      <Box sx={{ height: 160, overflow: 'hidden', bgcolor: '#f0f0f0' }}>
        {tour.image && (
          <CardMedia
            component="img"
            className="tour-image"
            sx={{ height: '100%', width: '100%', objectFit: "cover", transition: '0.6s' }}
            image={fullImageUrl}
            alt={tour.title}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        {/* Location with specific orange color */}
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1, color: '#ed8936' }}>
          <LocationOnIcon sx={{ fontSize: 14 }} />
          <Typography variant="caption" fontWeight="700" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {tour.location}
          </Typography>
        </Stack>

        {/* Title with better line height and wrapping */}
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: "800", color: "#2d3748", mb: 1.5, lineHeight: 1.3,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            height: '2.6em' // Fixed height for alignment across cards
          }}
        >
          {tour.title}
        </Typography>
        
        {/* Compact Meta Info Row */}
        <Stack direction="row" spacing={2} sx={{ mb: 2, color: 'text.secondary' }}>
           <Stack direction="row" spacing={0.5} alignItems="center">
              <CalendarTodayIcon sx={{ fontSize: 13 }} />
              <Typography variant="caption" fontWeight="500">{tour.days} Days</Typography>
           </Stack>
           <Stack direction="row" spacing={0.5} alignItems="center">
              <GroupsIcon sx={{ fontSize: 15 }} />
              <Typography variant="caption" fontWeight="500">{tour.person} Person</Typography>
           </Stack>
        </Stack>

        <Divider sx={{ mb: 2, borderStyle: 'dotted' }} />

        {/* Improved Price Alignment */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography variant="h6" sx={{ fontWeight: "900", color: "#e53e3e" }}>
              ₹{tour.discountPrice}
            </Typography>
            <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.disabled", fontWeight: 500 }}>
              ₹{tour.actualPrice}
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ bgcolor: '#fff5f5', color: '#e53e3e', px: 1, borderRadius: 1, fontWeight: 'bold' }}>
            SAVE ₹{tour.actualPrice - tour.discountPrice}
          </Typography>
        </Box>
      </CardContent>

      <Button
        variant="contained"
        fullWidth
        onClick={() => navigate(`/tours/${tour._id}`)}
        sx={{ 
          borderRadius: 0, 
          bgcolor: "#1a237e", 
          py: 1.5, 
          textTransform: 'none',
          fontWeight: 'bold',
          fontSize: '0.9rem',
          "&:hover": { bgcolor: "#ed8936" } 
        }}
      >
        View Details
      </Button>
    </Card>
  );
}