import React, { useEffect, useState } from "react";
import API from "../api";
import { 
  Container, Typography, Table, TableHead, TableRow, TableCell, 
  TableBody, Button, Box, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, Alert, Paper, TableContainer, 
  Avatar, Chip, Stack, IconButton, Tooltip, TablePagination 
} from "@mui/material";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", mobile: "", password: "", role: "customer" });

  // Pagination States
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchUsers = () => API.get("/admin/users").then(res => setUsers(res.data));
  useEffect(() => { fetchUsers(); }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddUser = async () => {
    try {
      setError("");
      await API.post("/register", newUser);
      setOpen(false);
      setNewUser({ name: "", email: "", mobile: "", password: "", role: "customer" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Permanently delete this user account?")) return;
    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4,
        background: "linear-gradient(90deg, #2d3748 0%, #4a5568 100%)",
        p: 3, borderRadius: 3, color: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">User Directory</Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>Manage staff and traveler accounts</Typography>
        </Box>
        <Button 
          variant="contained" startIcon={<PersonAddIcon />} onClick={() => setOpen(true)}
          sx={{ bgcolor: "#ed8936", "&:hover": { bgcolor: "#dd6b20" }, fontWeight: "bold", borderRadius: 2 }}
        >
          Add New User
        </Button>
      </Box>

      {/* Table Container */}
      <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#f7fafc' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact Info</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((u) => (
              <TableRow key={u._id} hover>
                <TableCell>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: u.role === 'admin' ? '#805ad5' : '#3182ce' }}>
                      {u.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="bold">{u.name}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="500">{u.email}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                    <ContactPhoneIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption">{u.mobile || "No Mobile"}</Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={u.role.toUpperCase()} 
                    size="small" 
                    sx={{ 
                      fontWeight: 'bold', 
                      bgcolor: u.role === 'admin' ? '#faf5ff' : '#ebf8ff',
                      color: u.role === 'admin' ? '#553c9a' : '#2b6cb0',
                      border: '1px solid'
                    }} 
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Delete User">
                    <IconButton color="error" onClick={() => deleteUser(u._id)} sx={{ bgcolor: '#fff5f5' }}>
                      <DeleteSweepIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 'bold', color: '#2d3748' }}>Create New Account</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField variant="outlined" label="Full Name" fullWidth 
              onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
            <TextField variant="outlined" label="Email Address" fullWidth 
              onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
            <TextField variant="outlined" label="Mobile Number" fullWidth 
              onChange={(e) => setNewUser({...newUser, mobile: e.target.value})} />
            <TextField variant="outlined" label="Password" type="password" fullWidth 
              onChange={(e) => setNewUser({...newUser, password: e.target.value})} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleAddUser} variant="contained" sx={{ bgcolor: '#2d3748', px: 4 }}>
            Create Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}