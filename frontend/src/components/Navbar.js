import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Box, Container } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const IMAGE_BASE = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";
  const [role, setRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => { setRole(localStorage.getItem("role")); }, []);
  const isLoggedIn = !!localStorage.getItem("token");

  const logout = () => { localStorage.clear(); setRole(null); navigate("/login"); };
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const links = role === "admin" 
    ? [{ label: "Dashboard", path: "/admin" }, { label: "Tours", path: "/admin/tours" }, { label: "Bookings", path: "/admin/bookings" }]
    : [{ label: "Home", path: "/" }, { label: "My Bookings", path: "/mybookings" }, { label: "Profile", path: "/profile" }];

  return (
    <AppBar position="sticky" sx={{ bgcolor: "white", color: "#1a237e", height: { xs: '70px', md: '90px' }, justifyContent: 'center' }}>
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box 
            component="img" 
            src={`${IMAGE_BASE}/uploads/applogo.png`} 
            alt="Logo" 
            sx={{ height: { xs: '50px', md: '75px' }, cursor: 'pointer' }} 
            onClick={() => navigate("/")} 
          />
          
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {isLoggedIn ? (
              <>
                {links.map((link) => (
                  <Button key={link.label} onClick={() => navigate(link.path)} sx={{ color: "#1a237e", fontWeight: "bold" }}>{link.label}</Button>
                ))}
                <Button variant="outlined" color="error" onClick={logout}>Logout</Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => navigate("/login")} sx={{ bgcolor: "#ff9800" }}>Login</Button>
            )}
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleMenu}><MenuIcon /></IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
              {links.map((link) => (
                <MenuItem key={link.label} onClick={() => { navigate(link.path); handleClose(); }}>{link.label}</MenuItem>
              ))}
              {isLoggedIn ? <MenuItem onClick={logout}>Logout</MenuItem> : <MenuItem onClick={() => navigate("/login")}>Login</MenuItem>}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}