import React, { useEffect, useState } from "react";
import API from "../api";
import { 
  Container, Typography, Table, TableHead, TableRow, TableCell, 
  TableBody, Select, MenuItem, Box, Paper, TableContainer, 
  Avatar, Chip, Stack, TablePagination 
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchBookings = () => API.get("/admin/bookings").then(res => setBookings(res.data));
  useEffect(() => { fetchBookings(); }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/admin/bookings/${id}`, { status });
      fetchBookings();
    } catch (err) { alert("Failed to update status"); }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed": return { color: "success" };
      case "Cancelled": return { color: "error" };
      default: return { color: "warning" };
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="900" color="#2d3748">Booking Management</Typography>
        <Typography variant="body2" color="text.secondary">Total Reservations: {bookings.length}</Typography>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#2d3748' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Tour Package</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((b) => (
              <TableRow key={b._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: '#ed8936', width: 35, height: 35 }}><PersonIcon fontSize="small" /></Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">{b.user?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{b.user?.email}</Typography>
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FlightTakeoffIcon fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="500" color="primary">{b.tour?.title}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip label={b.status} color={getStatusStyle(b.status).color} size="small" sx={{ fontWeight: 'bold' }} />
                </TableCell>
                <TableCell align="center">
                  <Select
                    value={b.status}
                    size="small"
                    onChange={e => updateStatus(b._id, e.target.value)}
                    sx={{ minWidth: 130, borderRadius: 2, fontSize: '0.875rem' }}
                  >
                    <MenuItem value="Pending">🕒 Pending</MenuItem>
                    <MenuItem value="Confirmed">✅ Confirmed</MenuItem>
                    <MenuItem value="Cancelled">❌ Cancelled</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={bookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
}