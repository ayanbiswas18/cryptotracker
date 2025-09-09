import {
  AppBar,
  Container,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useNavigate, useLocation } from "react-router-dom";
import { CryptoState } from "../CryptoContext";
import { TrendingUp, AccountBalanceWallet, Home } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  },
  title: {
    flex: 1,
    background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 800,
    fontSize: "1.8rem",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      filter: "drop-shadow(0 0 10px rgba(0, 212, 255, 0.5))",
    },
  },
  navButton: {
    margin: theme.spacing(0, 1),
    color: "white",
    fontWeight: 600,
    borderRadius: "12px",
    padding: theme.spacing(1, 2),
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(0, 212, 255, 0.1)",
      transform: "translateY(-2px)",
    },
  },
  activeButton: {
    background: "linear-gradient(45deg, rgba(0, 212, 255, 0.2), rgba(123, 104, 238, 0.2))",
    border: "1px solid rgba(0, 212, 255, 0.3)",
  },
  select: {
    color: "white",
    fontWeight: 600,
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: theme.spacing(0.5, 1),
    "&:before": {
      borderColor: "transparent",
    },
    "&:after": {
      borderColor: "#00d4ff",
    },
    "& .MuiSelect-icon": {
      color: "white",
    },
  },
}));

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

function Header() {
  const classes = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { currency, setCurrency } = CryptoState();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Market", icon: <Home /> },
    { path: "/portfolio", label: "Portfolio", icon: <AccountBalanceWallet /> },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static" className={classes.appBar}>
        <Container>
          <Toolbar>
            <Typography
              onClick={() => navigate("/")}
              variant="h6"
              className={classes.title}
            >
              <TrendingUp style={{ marginRight: "8px", verticalAlign: "middle" }} />
              CryptoVault
            </Typography>
            
            {!isMobile && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    className={`${classes.navButton} ${
                      location.pathname === item.path ? classes.activeButton : ""
                    }`}
                    startIcon={item.icon}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            )}

            <Select
              variant="outlined"
              value={currency}
              className={classes.select}
              style={{ width: 100, height: 40, marginLeft: 15 }}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value={"USD"}>USD</MenuItem>
              <MenuItem value={"EUR"}>EUR</MenuItem>
              <MenuItem value={"INR"}>INR</MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;