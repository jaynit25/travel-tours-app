import { 
  Container, Typography, Table, TableHead, TableRow, TableCell, 
  TableBody, Button, Box, Dialog, DialogTitle, DialogContent, 
  TextField, DialogActions, Alert 
} from "@mui/material";
import { useEffect, useState } from "react";
import API from "../api";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [newUser, setNewUser] = useState({ name: "", email: "", mobile: "", password: "", role: "customer" });

  const fetchUsers = () => API.get("/admin/users").then(res => setUsers(res.data));
  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async () => {
    try {
      setError("");
      await API.post("/register", newUser); // Using your existing register route
      setOpen(false);
      setNewUser({ name: "", email: "", mobile: "", password: "", role: "customer" });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Manage Users</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Add New User</Button>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(u => (
              <TableRow key={u._id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.mobile || "N/A"}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => deleteUser(u._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Add User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField 
            margin="dense" label="Name" fullWidth 
            onChange={(e) => setNewUser({...newUser, name: e.target.value})} 
          />
          <TextField 
            margin="dense" label="Email" fullWidth 
            onChange={(e) => setNewUser({...newUser, email: e.target.value})} 
          />
          <TextField 
            margin="dense" label="Mobile" fullWidth 
            onChange={(e) => setNewUser({...newUser, mobile: e.target.value})} 
          />
          <TextField 
            margin="dense" label="Password" type="password" fullWidth 
            onChange={(e) => setNewUser({...newUser, password: e.target.value})} 
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained">Create User</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}