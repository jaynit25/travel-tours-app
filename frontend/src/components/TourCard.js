import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TourCard({ tour }) {
  const navigate = useNavigate();


  return (
    <Card
  sx={{
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: 3,
    transition: "transform 0.3s",
    "&:hover": { transform: "scale(1.05)" }
  }}
>

  <CardMedia
    component="img"
    height="200"
    image={tour.image
  ? `${process.env.REACT_APP_BASE_URL}${tour.image}`
  : "/default.jpg"}
    alt={tour.title}
  />
  <CardContent sx={{ flexGrow: 1 }}>
    <Typography variant="h6">{tour.title}</Typography>
    <Typography variant="body2" color="text.secondary">{tour.location}</Typography>
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" sx={{ textDecoration: "line-through", color: "gray" }}>
        ₹{tour.actualPrice}
      </Typography>
      <Typography variant="h6" color="error">₹{tour.discountPrice}</Typography>
    </Box>
  </CardContent>
  <Button
    variant="contained"
    fullWidth
    onClick={() => navigate(`/tour/${tour._id}`)}
    sx={{ mt: "auto" }}
  >
    View More
  </Button>
</Card>

  );
}
