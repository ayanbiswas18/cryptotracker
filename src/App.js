import { makeStyles } from "@material-ui/core";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/HomePage";
import CoinPage from "./Pages/CoinPage";
import Portfolio from "./Pages/Portfolio";
import Header from "./components/Header";
import "./App.css";

const useStyles = makeStyles(() => ({
  App: {
    background: "linear-gradient(135deg, #0f0f1e 0%, #1a1a2e 50%, #16213e 100%)",
    color: "white",
    minHeight: "100vh",
    position: "relative",
    "&::before": {
      content: '""',
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `
        radial-gradient(circle at 20% 80%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(123, 104, 238, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(255, 107, 107, 0.05) 0%, transparent 50%)
      `,
      pointerEvents: "none",
      zIndex: -1,
    },
  },
}));

function App() {
  const classes = useStyles();

  return (
    <BrowserRouter basename="/cryptovault-dashboard">
      <div className={classes.App}>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/coins/:id" element={<CoinPage />} />
          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;