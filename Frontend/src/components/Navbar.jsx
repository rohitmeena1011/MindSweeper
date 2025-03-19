// import React, { useState, useContext } from "react"; 
// import { 
//   AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem 
// } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import { Psychology, Leaderboard, Login, Logout, Menu as MenuIcon } from "@mui/icons-material";
// import { useTheme } from "@mui/material/styles";
// import useMediaQuery from "@mui/material/useMediaQuery";
// import { AuthContext } from "../AuthContext"; 

// const Navbar = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"));
//   const navigate = useNavigate();
//   const [anchorEl, setAnchorEl] = useState(null);

//   const { isLoggedIn, logout } = useContext(AuthContext);; 

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   return (
//     <AppBar position="static" sx={{ background: "linear-gradient(to right, #1e1e2f, #292943)" }}>
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         <Typography 
//           variant="h5" 
//           component={Link} 
//           to="/" 
//           sx={{ 
//             textDecoration: "none", 
//             color: "#64b5f6", 
//             fontWeight: "bold", 
//             display: "flex", 
//             alignItems: "center",
//             gap: 1
//           }}
//         >
//           <Psychology fontSize="large" />
//           MindSweeper
//         </Typography>

//         {isMobile ? (
//           <>
//             <IconButton edge="end" color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
//               <MenuIcon />
//             </IconButton>
//             <Menu 
//               anchorEl={anchorEl} 
//               open={Boolean(anchorEl)} 
//               onClose={() => setAnchorEl(null)}
//               sx={{ "& .MuiPaper-root": { background: "#292943", color: "white" } }}
//             >
//               <MenuItem component={Link} to="/leaderboard" onClick={() => setAnchorEl(null)}>
//                 <Leaderboard sx={{ mr: 1 }} /> Leaderboard
//               </MenuItem>
//               {isLoggedIn ? (
//                 <MenuItem onClick={() => { handleLogout(); setAnchorEl(null); }}>
//                   <Logout sx={{ mr: 1 }} /> Logout
//                 </MenuItem>
//               ) : (
//                 <MenuItem component={Link} to="/login" onClick={() => setAnchorEl(null)}>
//                   <Login sx={{ mr: 1 }} /> Login
//                 </MenuItem>
//               )}
//             </Menu>
//           </>
//         ) : (
//           <div>
//             <Button 
//               component={Link} 
//               to="/leaderboard" 
//               color="inherit" 
//               startIcon={<Leaderboard />}
//               sx={{ textTransform: "none", fontSize: "20px" }}
//             >
//               Leaderboard
//             </Button>
//             {isLoggedIn ? (
//               <Button 
//                 onClick={handleLogout} 
//                 color="inherit" 
//                 startIcon={<Logout />}
//                 sx={{ textTransform: "none", fontSize: "20px" }}
//               >
//                 Logout
//               </Button>
//             ) : (
//               <Button 
//                 component={Link} 
//                 to="/login" 
//                 color="inherit" 
//                 startIcon={<Login />}
//                 sx={{ textTransform: "none", fontSize: "20px" }}
//               >
//                 Login
//               </Button>
//             )}
//           </div>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;


import React, { useState, useContext } from "react"; 
import { 
  AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem 
} from "@mui/material";
import { 
  Psychology, Leaderboard, Login, Logout, Menu as MenuIcon, 
  MenuBook
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AuthContext } from "../AuthContext"; 

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const { isLoggedIn, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar 
      position="static" 
      sx={{ background: "linear-gradient(to right, #1e1e2f, #292943)" }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* App Title / Logo */}
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

        {/* Mobile View: Hamburger Menu */}
        {isMobile ? (
          <>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={() => setAnchorEl(null)}
              sx={{ "& .MuiPaper-root": { background: "#292943", color: "white" } }}
            >
              {/* Leaderboard */}
              <MenuItem 
                component={Link} 
                to="/leaderboard" 
                onClick={() => setAnchorEl(null)}
              >
                <Leaderboard sx={{ mr: 1 }} /> 
                Leaderboard
              </MenuItem>

              {/* Rules - NEW */}
              <MenuItem 
                component={Link} 
                to="/rules" 
                onClick={() => setAnchorEl(null)}
              >
                <MenuBook sx={{ mr: 1 }} /> 
                Rules
              </MenuItem>

              {/* Login/Logout */}
              {isLoggedIn ? (
                <MenuItem
                  onClick={() => {
                    handleLogout();
                    setAnchorEl(null);
                  }}
                >
                  <Logout sx={{ mr: 1 }} /> 
                  Logout
                </MenuItem>
              ) : (
                <MenuItem 
                  component={Link} 
                  to="/login" 
                  onClick={() => setAnchorEl(null)}
                >
                  <Login sx={{ mr: 1 }} /> 
                  Login
                </MenuItem>
              )}
            </Menu>
          </>
        ) : (
          /* Desktop View: Buttons in the Toolbar */
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

            {/* Rules - NEW */}
            <Button
              component={Link}
              to="/rules"
              color="inherit"
              startIcon={<MenuBook />}
              sx={{ textTransform: "none", fontSize: "20px" }}
            >
              Rules
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

