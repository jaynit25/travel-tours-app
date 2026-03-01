import React, { useState } from "react";
import { 
  Fab, Dialog, DialogTitle, DialogContent, TextField, 
  Button, Box, IconButton, Typography, Grid, CircularProgress 
} from "@mui/material";
import MessageIcon from '@mui/icons-material/Message';
import CloseIcon from '@mui/icons-material/Close';
import API from "../api";

const InquiryCard = ({ tourName }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // New Loading State
  const [formData, setFormData] = useState({
    fullName: "", phoneNumber: "", email: "", 
    travelDate: "", message: "", adults: 1, children: 0, infants: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Disable button immediately
    
    try {
      const submissionData = {
        ...formData,
        adults: parseInt(formData.adults) || 0,
        children: parseInt(formData.children) || 0,
        infants: parseInt(formData.infants) || 0,
        tourName: tourName || "General Website Inquiry"
      };

      await API.post("/inquiry", submissionData);
      alert("Inquiry submitted successfully!");
      setOpen(false);
      setFormData({
        fullName: "", phoneNumber: "", email: "", 
        travelDate: "", message: "", adults: 1, children: 0, infants: 0
      });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error submitting inquiry.");
    } finally {
      setLoading(false); // Re-enable button
    }
  };

  return (
    <>
      <Fab 
        color="primary" 
        aria-label="inquiry"
        onClick={() => setOpen(true)}
        sx={{ 
          position: 'fixed', bottom: 30, right: 30, 
          bgcolor: '#ed8936', '&:hover': { bgcolor: '#dd6b20' },
          zIndex: 1000
        }}
      >
        <MessageIcon />
      </Fab>

      <Dialog 
        open={open} 
        onClose={() => !loading && setOpen(false)} // Prevent closing while loading
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#1a237e' }}>
          Get a Free Quote
          <IconButton
            onClick={() => setOpen(false)}
            disabled={loading} // Disable close button while loading
            sx={{ position: 'absolute', right: 16, top: 16 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#ed8936', fontWeight: 'bold' }}>
            {tourName ? `Inquiry for: ${tourName}` : "Tell us where you want to go!"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Full Name" name="fullName" required onChange={handleChange} value={formData.fullName} disabled={loading} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Phone Number" name="phoneNumber" required onChange={handleChange} value={formData.phoneNumber} disabled={loading} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email Address" type="email" name="email" required onChange={handleChange} value={formData.email} disabled={loading} />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth label="Travel Date" name="travelDate" type="date" 
                  InputLabelProps={{ shrink: true }} onChange={handleChange} value={formData.travelDate} disabled={loading}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Tour & Travel Details" name="message" multiline rows={2} onChange={handleChange} value={formData.message} disabled={loading} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Adults" type="number" name="adults" value={formData.adults} onChange={handleChange} disabled={loading} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Children" type="number" name="children" value={formData.children} onChange={handleChange} disabled={loading} />
              </Grid>
              <Grid item xs={4}>
                <TextField fullWidth label="Infants" type="number" name="infants" value={formData.infants} onChange={handleChange} disabled={loading} />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => setOpen(false)} 
                sx={{ borderRadius: 2 }} 
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                fullWidth 
                variant="contained" 
                type="submit" 
                disabled={loading} // THE FIX
                sx={{ 
                  bgcolor: '#ed8936', 
                  borderRadius: 2, 
                  fontWeight: 'bold', 
                  color: 'white',
                  '&:disabled': { bgcolor: '#fbd38d', color: '#fff' } 
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Request"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InquiryCard;