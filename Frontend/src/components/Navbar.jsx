import React, { useState } from "react";
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem 
} from "@mui/material";
import { Link } from "react-router-dom";
import { Psychology, Leaderboard, Login, Menu as MenuIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // Detects small screens

  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <AppBar 
      position="static" 
      sx={{ background: "linear-gradient(to right, #1e1e2f, #292943)" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* Brand Logo */}
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: "none", 
            color: "#64b5f6", 
            fontWeight: "bold", 
            display: "flex", 
            alignItems: "center",
            gap: 1
          }}
        >
          <Psychology fontSize="large" />
          MindSweeper
        </Typography>

        {/* Show Menu Icon on Mobile, Full Buttons on Desktop */}
        {isMobile ? (
          <>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={handleMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={handleMenuClose}
              sx={{ "& .MuiPaper-root": { background: "#292943", color: "white" } }}
            >
              <MenuItem component={Link} to="/leaderboard" onClick={handleMenuClose}>
                <Leaderboard sx={{ mr: 1 }} /> Leaderboard
              </MenuItem>
              <MenuItem component={Link} to="/login" onClick={handleMenuClose}>
                <Login sx={{ mr: 1 }} /> Login
              </MenuItem>
            </Menu>
          </>
        ) : (
          <div>
            <Button 
              component={Link} 
              to="/leaderboard" 
              color="inherit" 
              startIcon={<Leaderboard />}
              sx={{ textTransform: "none", fontSize: "20px" }}
            >
              Leaderboard
            </Button>
            <Button 
              component={Link} 
              to="/login" 
              color="inherit" 
              startIcon={<Login />}
              sx={{ textTransform: "none", fontSize: "20px" }}
            >
              Login
            </Button>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
