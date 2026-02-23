import React, { useState } from 'react';
import { Box, TextField, Button, Rating, Typography, Alert, Paper, Fade } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { submitReview } from '../../api';

const ReviewForm = ({ tourId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitReview({ tourId, rating, comment });
      setMsg({ type: 'success', text: 'Review sent! Our team will approve it shortly.' });
      setComment("");
      setRating(5);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || "Review submission failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in={true}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: 4, bgcolor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: '#ed8936', mb: 2 }}>Write a Review</Typography>
        
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2, textAlign: 'center' }}>
            <Rating size="large" value={rating} onChange={(e, val) => setRating(val)} />
            <Typography variant="caption" display="block" color="text.secondary">Click to rate</Typography>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            placeholder="Describe your tour guide, hotels, and experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          <Button 
            fullWidth
            type="submit" 
            variant="contained" 
            disabled={loading}
            endIcon={<SendIcon />}
            sx={{ bgcolor: '#ed8936', py: 1.5, borderRadius: 3, '&:hover': { bgcolor: '#dd6b20' } }}
          >
            {loading ? "Sending..." : "Post Review"}
          </Button>

          {msg.text && <Alert severity={msg.type} sx={{ mt: 2, borderRadius: 2 }}>{msg.text}</Alert>}
        </form>
      </Paper>
    </Fade>
  );
};

export default ReviewForm;