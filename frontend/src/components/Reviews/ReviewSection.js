import React, { useState, useEffect } from "react";
// IMPORT ALL NECESSARY COMPONENTS HERE
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Rating, 
  Divider, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText, 
  Paper,
  Alert
} from "@mui/material";
import { getTourReviews, submitReview } from "../../api";

export default function ReviewSection({ tourId, isLoggedIn }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadReviews();
  }, [tourId]);

  const loadReviews = async () => {
    try {
      const data = await getTourReviews(tourId);
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitReview({ tourId, rating, comment });
      setMsg("Review submitted! It will appear after admin approval.");
      setComment("");
      setRating(5);
    } catch (err) {
      setMsg(err.response?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h5" fontWeight="800" gutterBottom>
        Customer Reviews
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* Review Submission Form - ONLY FOR LOGGED IN USERS */}
      {isLoggedIn ? (
        <Paper elevation={0} sx={{ p: 3, bgcolor: "#f8f9fa", borderRadius: 4, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Write a Review</Typography>
          {msg && <Alert severity="info" sx={{ mb: 2 }}>{msg}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit}>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Share your experience with this tour..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              sx={{ bgcolor: "white", mb: 2 }}
            />
            <Button type="submit" variant="contained" sx={{ bgcolor: "#1a237e" }}>
              Submit Review
            </Button>
          </Box>
        </Paper>
      ) : (
        <Alert severity="warning" sx={{ mb: 4, borderRadius: 3 }}>
          Please <Button href="/login" size="small" sx={{ fontWeight: 'bold' }}>Login</Button> to share your own review.
        </Alert>
      )}

      {/* Reviews List - VISIBLE TO EVERYONE */}
      <List sx={{ width: '100%' }}>
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <ListItem key={rev._id} alignItems="flex-start" sx={{ px: 0, mb: 2 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "#ed8936" }}>{rev.user?.name?.charAt(0)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography fontWeight="bold">{rev.user?.name}</Typography>
                    <Rating value={rev.rating} readOnly size="small" />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                    {rev.comment}
                  </Typography>
                }
              />
            </ListItem>
          ))
        ) : (
          <Typography color="text.secondary">No reviews yet for this tour.</Typography>
        )}
      </List>
    </Box>
  );
}