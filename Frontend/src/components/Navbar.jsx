import React, { useState, useEffect } from "react";
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem 
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Psychology, Leaderboard, Login, Logout, Menu as MenuIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("authToken"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("authToken"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false); 
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ background: "linear-gradient(to right, #1e1e2f, #292943)" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
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

        {isMobile ? (
          <>
            <IconButton edge="end" color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <MenuIcon />
            </IconButton>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={() => setAnchorEl(null)}
              sx={{ "& .MuiPaper-root": { background: "#292943", color: "white" } }}
            >
              <MenuItem component={Link} to="/leaderboard" onClick={() => setAnchorEl(null)}>
                <Leaderboard sx={{ mr: 1 }} /> Leaderboard
              </MenuItem>
              {isLoggedIn ? (
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              ) : (
                <MenuItem component={Link} to="/login" onClick={() => setAnchorEl(null)}>
                  <Login sx={{ mr: 1 }} /> Login
                </MenuItem>
              )}
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
            {isLoggedIn ? (
              <Button 
                onClick={handleLogout} 
                color="inherit" 
                startIcon={<Logout />}
                sx={{ textTransform: "none", fontSize: "20px" }}
              >
                Logout
              </Button>
            ) : (
              <Button 
                component={Link} 
                to="/login" 
                color="inherit" 
                startIcon={<Login />}
                sx={{ textTransform: "none", fontSize: "20px" }}
              >
                Login
              </Button>
            )}
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
