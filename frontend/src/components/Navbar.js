import { AppBar, Toolbar, Button, IconButton, Menu, MenuItem, Box, Container, Avatar, Divider, Stack } from "@mui/material";
import { Menu as MenuIcon, Logout as LogoutIcon, Person as PersonIcon } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // To highlight the active link
  const IMAGE_BASE = process.env.REACT_APP_Image_BASE_URL || "http://localhost:5000";
  
  const [role, setRole] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => { 
    setRole(localStorage.getItem("role")); 
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, [location]); // Refresh status on route change

  const logout = () => { 
    localStorage.clear(); 
    setRole(null); 
    setIsLoggedIn(false);
    navigate("/login"); 
  };
  
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const links = role === "admin" 
    ? [
        { label: "Dashboard", path: "/admin" }, 
        { label: "Tours", path: "/admin/tours" }, 
        { label: "Bookings", path: "/admin/bookings" },
        { label: "Users", path: "/admin/users" },
        { label: "Reviews", path: "/admin/reviews" },
        { label: "Inquiries", path: "/admin/inquiries" }
      ]
    : [
        { label: "Home", path: "/" }, 
        { label: "My Bookings", path: "/mybookings" }, 
        { label: "Profile", path: "/profile" }
      ];

  const activeStyle = {
    color: "#ed8936",
    "&::after": {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '10%',
      width: '80%',
      height: '3px',
      backgroundColor: '#ed8936',
      borderRadius: '10px'
    }
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: "rgba(255, 255, 255, 0.95)", 
        backdropFilter: "blur(10px)",
        color: "#1a237e", 
        height: { xs: '70px', md: '85px' }, 
        justifyContent: 'center', 
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        borderBottom: "1px solid #f0f0f0"
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* LOGO */}
          <Box 
            component="img" 
            src={`${IMAGE_BASE}/uploads/applogo.png`} 
            alt="Khodiyar Logo" 
            sx={{ height: { xs: '45px', md: '65px' }, cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'scale(1.05)' } }} 
            onClick={() => navigate("/")} 
          />
          
          {/* DESKTOP MENU */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: 'center', gap: 1 }}>
            {isLoggedIn ? (
              <>
                <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
                  {links.map((link) => (
                    <Button 
                      key={link.label} 
                      onClick={() => navigate(link.path)} 
                      sx={{ 
                        color: "#2d3748", 
                        fontWeight: "600",
                        px: 2,
                        position: 'relative',
                        transition: '0.3s',
                        ...(location.pathname === link.path ? activeStyle : {}),
                        "&:hover": { color: "#ed8936", bgcolor: 'transparent' }
                      }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Stack>
                
                <IconButton onClick={handleMenu} sx={{ p: 0, border: '2px solid #ed8936' }}>
                  <Avatar sx={{ bgcolor: "#ed8936", width: 35, height: 35 }}>
                    <PersonIcon />
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Stack direction="row" spacing={2}>
                <Button onClick={() => navigate("/")} sx={{ color: "#2d3748", fontWeight: "bold" }}>Home</Button>
                <Button 
                  variant="contained" 
                  onClick={() => navigate("/login")} 
                  sx={{ 
                    bgcolor: "#ed8936", 
                    boxShadow: '0 4px 14px rgba(237, 137, 54, 0.4)',
                    borderRadius: '8px',
                    "&:hover": { bgcolor: "#dd6b20", boxShadow: '0 6px 20px rgba(237, 137, 54, 0.23)' } 
                  }}
                >
                  Login
                </Button>
              </Stack>
            )}
          </Box>

          {/* MOBILE MENU TOGGLE */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton color="inherit" onClick={handleMenu}>
              <MenuIcon sx={{ fontSize: '30px', color: '#ed8936' }} />
            </IconButton>
          </Box>

          {/* DROPDOWN MENU (Universal for Mobile & Desktop Profile) */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{
              sx: { width: 200, mt: 1.5, borderRadius: 3, boxShadow: '0 10px 25px rgba(0,0,0,0.1)', p: 1 }
            }}
          >
            {/* Show links in menu for Mobile only */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              {isLoggedIn ? (
                links.map((link) => (
                  <MenuItem key={link.label} onClick={() => { navigate(link.path); handleClose(); }}>
                    {link.label}
                  </MenuItem>
                ))
              ) : (
                <MenuItem onClick={() => { navigate("/"); handleClose(); }}>Home</MenuItem>
              )}
              <Divider sx={{ my: 1 }} />
            </Box>

            {isLoggedIn ? (
              <MenuItem onClick={logout} sx={{ color: '#e53e3e', fontWeight: 'bold' }}>
                <LogoutIcon sx={{ mr: 1, fontSize: '18px' }} /> Logout
              </MenuItem>
            ) : (
              <MenuItem onClick={() => { navigate("/login"); handleClose(); }}>Login</MenuItem>
            )}
          </Menu>

        </Toolbar>
      </Container>
    </AppBar>
  );
}