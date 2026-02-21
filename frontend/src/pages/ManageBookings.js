import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, Box } from "@mui/material";
import { useEffect, useState } from "react";
import API from "../api";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => API.get("/admin/bookings").then(res => setBookings(res.data));
  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/admin/bookings/${id}`, { status });
    fetchBookings();
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h4" mb={3}>Manage Bookings</Typography>

      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ minWidth: 120 }}>User</TableCell>
              <TableCell sx={{ minWidth: 150 }}>Tour</TableCell>
              <TableCell sx={{ minWidth: 120 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map(b => (
              <TableRow key={b._id}>
                <TableCell>{b.user.name}</TableCell>
                <TableCell>{b.tour.title}</TableCell>
                <TableCell>
                  <Select
                    value={b.status}
                    onChange={e => updateStatus(b._id, e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Container>
  );
}
