import React, { useEffect, useState } from "react";
import { getAllReviewsAdmin, updateReviewStatus } from "../api";
import { 
  Container, Typography, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Paper, Button, 
  Chip, Avatar, Box, Rating, TablePagination, Stack
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchList = async () => {
    try {
      const data = await getAllReviewsAdmin();
      setReviews(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchList(); }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="900" color="#2d3748">Review Moderation</Typography>
        <Chip label={`${reviews.length} Total`} color="primary" variant="outlined" />
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 700 }}>
          <TableHead sx={{ bgcolor: '#2d3748' }}>
            <TableRow>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Package</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Feedback</TableCell>
              <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviews
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ bgcolor: '#ed8936', width: 32, height: 32, fontSize: '0.9rem' }}>
                      {row.user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" fontWeight="600">{row.user?.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell><Typography variant="body2" color="primary">{row.tour?.title}</Typography></TableCell>
                <TableCell sx={{ maxWidth: 250 }}>
                  <Rating value={row.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" noWrap>{row.comment}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={row.isApproved ? "Public" : "Pending"} 
                    size="small"
                    sx={{ bgcolor: row.isApproved ? '#c6f6d5' : '#feebc8', color: row.isApproved ? '#22543d' : '#744210', fontWeight: 'bold' }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" size="small"
                    startIcon={row.isApproved ? <VisibilityOffIcon /> : <CheckCircleIcon />}
                    color={row.isApproved ? "inherit" : "success"}
                    onClick={async () => {
                      await updateReviewStatus(row._id, !row.isApproved);
                      fetchList();
                    }}
                    sx={{ borderRadius: 2, textTransform: 'none', minWidth: 100 }}
                  >
                    {row.isApproved ? "Hide" : "Approve"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={reviews.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default ManageReviews;