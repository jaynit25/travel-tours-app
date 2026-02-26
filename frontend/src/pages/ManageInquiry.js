import React, { useEffect, useState } from "react";
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Box, CircularProgress 
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import API from "../api";

export default function ManageInquiry() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await API.get("/admin/inquiries");
      setInquiries(res.data);
    } catch (err) {
      console.error("Error fetching inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteInquiry = async (id) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      try {
        await API.delete(`/admin/inquiry/${id}`);
        setInquiries(inquiries.filter(i => i._id !== id));
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  const viewMessage = (item) => {
      alert(`Customer Message: \n\n${item.message || "No message provided."}`);
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: '#1a237e' }}>
        Customer Inquiries (Leads)
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f8fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tour / Package</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pax (A/C/I)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inquiries.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center">No inquiries found.</TableCell></TableRow>
            ) : (
                inquiries.map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>{new Date(item.createdAt).toLocaleDateString('en-IN')}</TableCell>
                      <TableCell>
                          <Typography variant="body2" fontWeight="bold">{item.tourName || "General"}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            Travel Date: {item.travelDate ? new Date(item.travelDate).toLocaleDateString() : 'N/A'}
                          </Typography>
                      </TableCell>
                      <TableCell>{item.fullName}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.email}</Typography>
                        <Typography variant="body2" color="primary" fontWeight="bold">{item.phoneNumber}</Typography>
                      </TableCell>
                      <TableCell>
                         <Chip label={`${item.adults} / ${item.children} / ${item.infants}`} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={item.status || "New"} 
                          color={item.status === 'Followed Up' ? 'success' : 'error'} 
                          size="small" 
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => viewMessage(item)} title="View Message">
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => deleteInquiry(item._id)} title="Delete Lead">
                            <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}