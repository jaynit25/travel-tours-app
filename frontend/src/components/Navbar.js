import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  Box, 
  Container 
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
    const API_BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
  const [role, setRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // Sync role from localStorage on mount and when token changes
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const isLoggedIn = !!localStorage.getItem("token");

  const logout = () => {
    localStorage.clear();
    setRole(null);
    navigate("/login");
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const adminLinks = [
    { label: "Dashboard", path: "/admin" },
    { label: "Tours", path: "/admin/tours" },
    { label: "Bookings", path: "/admin/bookings" },
    { label: "Users", path: "/admin/users" },
  ];

  const customerLinks = [
    { label: "Home", path: "/" },
    { label: "My Bookings", path: "/mybookings" },
    { label: "Profile", path: "/profile" },
  ];

  const links = role === "admin" ? adminLinks : customerLinks;

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
    bgcolor: "white", 
    color: "#1a237e", 
    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
    // Set a fixed height for the Navbar to prevent stretching
    height: { xs: '70px', md: '90px' }, 
    justifyContent: 'center'
  }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 0 }}>
          
          {/* --- LOGO SECTION --- */}
          <Box 
            component="img"
            src={`${API_BASE_URL}/uploads/applogo.png`} // Ensure logo.png is inside your 'public' folder
            alt="Khodiyar Global Holidays"
            sx={{ 
          // Increase height but use 'objectFit' to keep it contained
          height: { xs: '55px', md: '90px' }, 
          width: {xs:'180px'}, // Keep aspect ratio
          cursor: "pointer",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "scale(1.05)" }
        }}
            onClick={() => navigate("/")}
          />

          {/* --- DESKTOP NAVIGATION --- */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {isLoggedIn ? (
              <>
                {links.map((link) => (
                  <Button 
                    key={link.label} 
                    onClick={() => navigate(link.path)}
                    sx={{ 
                      color: "#1a237e", 
                      fontWeight: "600",
                      "&:hover": { color: "#ff9800" } 
                    }}
                  >
                    {link.label}
                  </Button>
                ))}
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={logout}
                  sx={{ ml: 2, borderRadius: "20px" }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                onClick={() => navigate("/login")}
                sx={{ 
                  bgcolor: "#ff9800", 
                  "&:hover": { bgcolor: "#e68a00" },
                  borderRadius: "20px",
                  px: 4
                }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* --- MOBILE NAVIGATION --- */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            {!isLoggedIn && (
               <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            )}
            
            {isLoggedIn && (
              <>
                <IconButton color="inherit" onClick={handleMenu}>
                  <MenuIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  {links.map((link) => (
                    <MenuItem
                      key={link.label}
                      onClick={() => {
                        navigate(link.path);
                        handleClose();
                      }}
                    >
                      {link.label}
                    </MenuItem>
                  ))}
                  <MenuItem
                    onClick={() => {
                      logout();
                      handleClose();
                    }}
                    sx={{ color: "error.main" }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>

        </Toolbar>
      </Container>
    </AppBar>
  );
}