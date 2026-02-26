import React, { useEffect, useState } from "react";
import API from "../api";
import TourModal from "../components/TourModal";
import {
  Container, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Box, Paper, TableContainer, Avatar, 
  Chip, IconButton, Tooltip, Stack, TablePagination // Added Pagination
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';

export default function ManageTours() {
  const [tours, setTours] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchTours = () => {
    API.get("/tours").then(res => setTours(res.data));
  };

  useEffect(() => {
    fetchTours();
  }, []);

  // Pagination Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteTour = async (id) => {
    if (!window.confirm("Delete this tour package permanently?")) return;
    await API.delete(`/tours/${id}`);
    fetchTours();
  };

  const openAdd = () => {
    setSelectedTour(null);
    setModalOpen(true);
  };

  const openEdit = (tour) => {
    setSelectedTour(tour);
    setModalOpen(true);
  };

  const saveTour = async (formData) => {
    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (selectedTour) {
        await API.put(`/tours/${selectedTour._id}`, formData, config);
      } else {
        await API.post("/tours", formData, config);
      }
      setModalOpen(false);
      fetchTours();
    } catch (err) {
      alert(err.response?.data?.message || "Error saving tour");
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4,
        background: "linear-gradient(90deg, #2d3748 0%, #4a5568 100%)",
        p: 3, borderRadius: 3, color: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Manage Tours</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Total Packages: {tours.length}</Typography>
        </Box>
        <Button 
          variant="contained" startIcon={<AddIcon />} onClick={openAdd}
          sx={{ bgcolor: "#ed8936", "&:hover": { bgcolor: "#dd6b20" }, fontWeight: "bold", borderRadius: 2 }}
        >
          Add New Tour
        </Button>
      </Box>

      {/* Table Section */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
        <Table sx={{ minWidth: 1000 }}>
          <TableHead sx={{ bgcolor: "#f7fafc" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Tour Info</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Pricing</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {/* Slice the data for pagination */}
            {tours
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((t) => (
              <TableRow key={t._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar 
                        src={t.image ? (t.image.startsWith('http') ? t.image : `${process.env.REACT_APP_Image_BASE_URL}${t.image}`) : ""} 
                        variant="rounded" 
                        sx={{ width: 50, height: 50, bgcolor: '#f0f0f0' }}
                      >
                        {!t.image && t.title.charAt(0)} {/* Shows first letter if no image */}
                      </Avatar>
                    <Typography variant="subtitle2" fontWeight="bold">{t.title}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "text.secondary" }}>
                    <LocationOnIcon fontSize="inherit" />
                    <Typography variant="body2">{t.location}</Typography>
                  </Stack>
                </TableCell>
                <TableCell><Chip label={t.category} size="small" variant="outlined" /></TableCell>
                <TableCell>{t.days} Days / {t.person} Person</TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ textDecoration: "line-through", color: "gray", display: "block" }}>₹{t.actualPrice}</Typography>
                  <Typography variant="body1" sx={{ color: "#e53e3e", fontWeight: "bold" }}>₹{t.discountPrice}</Typography>
                </TableCell>
                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Tooltip title="Edit"><IconButton onClick={() => openEdit(t)} color="primary" sx={{ bgcolor: "#ebf8ff" }}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton onClick={() => deleteTour(t._id)} color="error" sx={{ bgcolor: "#fff5f5" }}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PAGINATION COMPONENT */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={tours.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: '1px solid #e2e8f0' }}
        />
      </TableContainer>

      <TourModal open={modalOpen} handleClose={() => setModalOpen(false)} handleSave={saveTour} selectedTour={selectedTour} />
    </Container>
  );
}