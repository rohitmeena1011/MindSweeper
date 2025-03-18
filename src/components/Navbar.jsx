import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Psychology, Leaderboard, Login } from "@mui/icons-material";

const Navbar = () => {
  return (
    <AppBar 
      position="static" 
      sx={{ background: "linear-gradient(to right, #1e1e2f, #292943)" }}
    >
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
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
