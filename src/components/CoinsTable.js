import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
  Chip,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Star, 
  StarBorder,
  FilterList 
} from "@material-ui/icons";
import axios from "axios";
import { CoinList } from "../config/api";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../CryptoContext";

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function CoinsTable() {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("market_cap_desc");

  const { currency, symbol, watchlist, addToWatchlist, removeFromWatchlist } = CryptoState();

  const useStyles = makeStyles((theme) => ({
    container: {
      padding: theme.spacing(4, 0),
    },
    title: {
      textAlign: "center",
      marginBottom: theme.spacing(4),
      fontSize: "2.5rem",
      fontWeight: 700,
      background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontFamily: "'Inter', sans-serif",
    },
    searchContainer: {
      display: "flex",
      gap: theme.spacing(2),
      marginBottom: theme.spacing(3),
      alignItems: "center",
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
      },
    },
    searchField: {
      flex: 1,
      "& .MuiOutlinedInput-root": {
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "15px",
        color: "white",
        "&:hover": {
          border: "1px solid rgba(0, 212, 255, 0.3)",
        },
        "&.Mui-focused": {
          border: "1px solid #00d4ff",
          boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
        },
      },
      "& .MuiInputLabel-root": {
        color: "rgba(255, 255, 255, 0.7)",
      },
    },
    tableContainer: {
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "20px",
      overflow: "hidden",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
    },
    tableHead: {
      background: "linear-gradient(45deg, rgba(0, 212, 255, 0.2), rgba(123, 104, 238, 0.2))",
    },
    tableHeadCell: {
      color: "white",
      fontWeight: 700,
      fontSize: "1rem",
      fontFamily: "'Inter', sans-serif",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        color: "#00d4ff",
      },
    },
    row: {
      backgroundColor: "transparent",
      cursor: "pointer",
      transition: "all 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(0, 212, 255, 0.1)",
        transform: "scale(1.01)",
      },
      fontFamily: "'Inter', sans-serif",
    },
    coinCell: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    coinImage: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      border: "2px solid rgba(255, 255, 255, 0.1)",
    },
    coinInfo: {
      display: "flex",
      flexDirection: "column",
    },
    coinSymbol: {
      textTransform: "uppercase",
      fontSize: "1.2rem",
      fontWeight: 700,
      color: "white",
    },
    coinName: {
      color: "rgba(255, 255, 255, 0.6)",
      fontSize: "0.9rem",
    },
    priceCell: {
      color: "white",
      fontWeight: 600,
      fontSize: "1.1rem",
    },
    changeCell: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontWeight: 600,
    },
    marketCapCell: {
      color: "white",
      fontWeight: 600,
    },
    pagination: {
      "& .MuiPaginationItem-root": {
        color: "white",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        "&:hover": {
          backgroundColor: "rgba(0, 212, 255, 0.2)",
          border: "1px solid #00d4ff",
        },
        "&.Mui-selected": {
          background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
          color: "white",
          fontWeight: 700,
        },
      },
    },
    rankChip: {
      background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
      color: "white",
      fontWeight: 700,
      fontSize: "0.8rem",
    },
    watchlistButton: {
      color: "rgba(255, 255, 255, 0.6)",
      transition: "all 0.3s ease",
      "&:hover": {
        color: "#ffd700",
        transform: "scale(1.2)",
      },
    },
    watchlistActive: {
      color: "#ffd700",
    },
  }));

  const classes = useStyles();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinList(currency));
      setCoins(data);
    } catch (error) {
      console.error("Error fetching coins:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  const isInWatchlist = (coinId) => {
    return watchlist.some(coin => coin.id === coinId);
  };

  const handleWatchlist = (coin, event) => {
    event.stopPropagation();
    if (isInWatchlist(coin.id)) {
      removeFromWatchlist(coin.id);
    } else {
      addToWatchlist(coin);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container className={classes.container}>
        <Typography className={classes.title}>
          Cryptocurrency Market Overview
        </Typography>
        
        <div className={classes.searchContainer}>
          <TextField
            label="Search cryptocurrencies..."
            variant="outlined"
            className={classes.searchField}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search style={{ color: "rgba(255, 255, 255, 0.5)" }} />
                </InputAdornment>
              ),
            }}
          />
        </div>

        <TableContainer component={Paper} className={classes.tableContainer}>
          {loading ? (
            <LinearProgress 
              style={{ 
                background: "rgba(0, 212, 255, 0.2)",
                "& .MuiLinearProgress-bar": {
                  background: "linear-gradient(45deg, #00d4ff, #7b68ee)"
                }
              }} 
            />
          ) : (
            <Table aria-label="cryptocurrency table">
              <TableHead className={classes.tableHead}>
                <TableRow>
                  <TableCell className={classes.tableHeadCell}>Rank</TableCell>
                  <TableCell className={classes.tableHeadCell}>Coin</TableCell>
                  <TableCell className={classes.tableHeadCell} align="right">Price</TableCell>
                  <TableCell className={classes.tableHeadCell} align="right">24h Change</TableCell>
                  <TableCell className={classes.tableHeadCell} align="right">Market Cap</TableCell>
                  <TableCell className={classes.tableHeadCell} align="center">Watchlist</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {handleSearch()
                  .slice((page - 1) * 10, (page - 1) * 10 + 10)
                  .map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => navigate(`/coins/${row.id}`)}
                        className={classes.row}
                        key={row.name}
                      >
                        <TableCell>
                          <Chip 
                            label={row.market_cap_rank} 
                            className={classes.rankChip}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <div className={classes.coinCell}>
                            <img
                              src={row?.image}
                              alt={row.name}
                              className={classes.coinImage}
                            />
                            <div className={classes.coinInfo}>
                              <span className={classes.coinSymbol}>
                                {row.symbol}
                              </span>
                              <span className={classes.coinName}>
                                {row.name}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell align="right" className={classes.priceCell}>
                          {symbol} {numberWithCommas(row.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell align="right">
                          <div 
                            className={classes.changeCell}
                            style={{
                              color: profit ? "rgb(14, 203, 129)" : "#ff6b6b",
                              justifyContent: "flex-end",
                            }}
                          >
                            {profit ? <TrendingUp /> : <TrendingDown />}
                            {profit && "+"}
                            {row.price_change_percentage_24h.toFixed(2)}%
                          </div>
                        </TableCell>
                        <TableCell align="right" className={classes.marketCapCell}>
                          {symbol} {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}M
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            className={`${classes.watchlistButton} ${
                              isInWatchlist(row.id) ? classes.watchlistActive : ""
                            }`}
                            onClick={(e) => handleWatchlist(row, e)}
                          >
                            {isInWatchlist(row.id) ? <Star /> : <StarBorder />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>

        <Pagination
          count={Math.ceil(handleSearch()?.length / 10)}
          style={{
            padding: 20,
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
}