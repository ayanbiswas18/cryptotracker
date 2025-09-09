import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  makeStyles,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core";
import { Add, Delete, TrendingUp, TrendingDown, AccountBalanceWallet } from "@material-ui/icons";
import { CryptoState } from "../CryptoContext";
import { numberWithCommas } from "../components/CoinsTable";
import axios from "axios";
import { CoinList } from "../config/api";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4, 0),
    minHeight: "80vh",
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
  statsGrid: {
    marginBottom: theme.spacing(4),
  },
  statCard: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 20px 40px rgba(0, 212, 255, 0.2)",
    },
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "white",
    marginBottom: theme.spacing(1),
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "1rem",
  },
  addButton: {
    background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
    color: "white",
    fontWeight: 600,
    padding: theme.spacing(1.5, 3),
    borderRadius: "12px",
    marginBottom: theme.spacing(3),
    "&:hover": {
      background: "linear-gradient(45deg, #00b8e6, #6a5acd)",
      transform: "translateY(-2px)",
    },
  },
  tableContainer: {
    background: "rgba(255, 255, 255, 0.05)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "20px",
    overflow: "hidden",
  },
  tableHead: {
    background: "linear-gradient(45deg, rgba(0, 212, 255, 0.2), rgba(123, 104, 238, 0.2))",
  },
  tableHeadCell: {
    color: "white",
    fontWeight: 700,
    fontSize: "1rem",
    fontFamily: "'Inter', sans-serif",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "rgba(0, 212, 255, 0.1)",
    },
  },
  emptyState: {
    textAlign: "center",
    padding: theme.spacing(8),
    color: "rgba(255, 255, 255, 0.6)",
  },
  emptyIcon: {
    fontSize: "4rem",
    marginBottom: theme.spacing(2),
    color: "rgba(255, 255, 255, 0.3)",
  },
  dialog: {
    "& .MuiDialog-paper": {
      background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "20px",
    },
  },
  dialogTitle: {
    background: "linear-gradient(45deg, rgba(0, 212, 255, 0.2), rgba(123, 104, 238, 0.2))",
    color: "white",
    fontWeight: 700,
    fontFamily: "'Inter', sans-serif",
  },
  textField: {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.3)",
      },
      "&:hover fieldset": {
        borderColor: "#00d4ff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#00d4ff",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
    },
  },
}));

const Portfolio = () => {
  const classes = useStyles();
  const { currency, symbol } = CryptoState();
  const [portfolio, setPortfolio] = useState([]);
  const [open, setOpen] = useState(false);
  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const savedPortfolio = localStorage.getItem("cryptovault-portfolio");
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cryptovault-portfolio", JSON.stringify(portfolio));
  }, [portfolio]);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const { data } = await axios.get(CoinList(currency));
        setCoins(data);
      } catch (error) {
        console.error("Error fetching coins:", error);
      }
    };
    fetchCoins();
  }, [currency]);

  const addToPortfolio = () => {
    if (coinId && amount && purchasePrice) {
      const coin = coins.find(c => c.id === coinId);
      if (coin) {
        const newHolding = {
          id: Date.now(),
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image,
          amount: parseFloat(amount),
          purchasePrice: parseFloat(purchasePrice),
          currentPrice: coin.current_price,
        };
        setPortfolio([...portfolio, newHolding]);
        setOpen(false);
        setCoinId("");
        setAmount("");
        setPurchasePrice("");
      }
    }
  };

  const removeFromPortfolio = (id) => {
    setPortfolio(portfolio.filter(item => item.id !== id));
  };

  const calculateStats = () => {
    let totalValue = 0;
    let totalInvested = 0;
    
    portfolio.forEach(holding => {
      const currentCoin = coins.find(c => c.id === holding.coinId);
      if (currentCoin) {
        totalValue += holding.amount * currentCoin.current_price;
        totalInvested += holding.amount * holding.purchasePrice;
      }
    });

    const totalGainLoss = totalValue - totalInvested;
    const totalGainLossPercentage = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;

    return { totalValue, totalInvested, totalGainLoss, totalGainLossPercentage };
  };

  const stats = calculateStats();

  return (
    <Container className={classes.container}>
      <Typography className={classes.title}>
        Portfolio Dashboard
      </Typography>

      <Grid container spacing={3} className={classes.statsGrid}>
        <Grid item xs={12} md={3}>
          <Card className={classes.statCard}>
            <CardContent style={{ textAlign: "center" }}>
              <Typography className={classes.statValue}>
                {symbol}{numberWithCommas(stats.totalValue.toFixed(2))}
              </Typography>
              <Typography className={classes.statLabel}>
                Total Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className={classes.statCard}>
            <CardContent style={{ textAlign: "center" }}>
              <Typography className={classes.statValue}>
                {symbol}{numberWithCommas(stats.totalInvested.toFixed(2))}
              </Typography>
              <Typography className={classes.statLabel}>
                Total Invested
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className={classes.statCard}>
            <CardContent style={{ textAlign: "center" }}>
              <Typography 
                className={classes.statValue}
                style={{ color: stats.totalGainLoss >= 0 ? "rgb(14, 203, 129)" : "#ff6b6b" }}
              >
                {stats.totalGainLoss >= 0 ? "+" : ""}{symbol}{numberWithCommas(stats.totalGainLoss.toFixed(2))}
              </Typography>
              <Typography className={classes.statLabel}>
                Total P&L
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card className={classes.statCard}>
            <CardContent style={{ textAlign: "center" }}>
              <Typography 
                className={classes.statValue}
                style={{ color: stats.totalGainLossPercentage >= 0 ? "rgb(14, 203, 129)" : "#ff6b6b" }}
              >
                {stats.totalGainLossPercentage >= 0 ? "+" : ""}{stats.totalGainLossPercentage.toFixed(2)}%
              </Typography>
              <Typography className={classes.statLabel}>
                Total Return
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Button
        className={classes.addButton}
        startIcon={<Add />}
        onClick={() => setOpen(true)}
      >
        Add Holding
      </Button>

      {portfolio.length === 0 ? (
        <div className={classes.emptyState}>
          <AccountBalanceWallet className={classes.emptyIcon} />
          <Typography variant="h5" style={{ marginBottom: "16px" }}>
            Your portfolio is empty
          </Typography>
          <Typography>
            Start tracking your cryptocurrency investments by adding your first holding.
          </Typography>
        </div>
      ) : (
        <TableContainer component={Paper} className={classes.tableContainer}>
          <Table>
            <TableHead className={classes.tableHead}>
              <TableRow>
                <TableCell className={classes.tableHeadCell}>Asset</TableCell>
                <TableCell className={classes.tableHeadCell} align="right">Holdings</TableCell>
                <TableCell className={classes.tableHeadCell} align="right">Avg. Buy Price</TableCell>
                <TableCell className={classes.tableHeadCell} align="right">Current Price</TableCell>
                <TableCell className={classes.tableHeadCell} align="right">Market Value</TableCell>
                <TableCell className={classes.tableHeadCell} align="right">P&L</TableCell>
                <TableCell className={classes.tableHeadCell} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {portfolio.map((holding) => {
                const currentCoin = coins.find(c => c.id === holding.coinId);
                const currentPrice = currentCoin ? currentCoin.current_price : holding.currentPrice;
                const marketValue = holding.amount * currentPrice;
                const investedValue = holding.amount * holding.purchasePrice;
                const gainLoss = marketValue - investedValue;
                const gainLossPercentage = (gainLoss / investedValue) * 100;

                return (
                  <TableRow key={holding.id} className={classes.tableRow}>
                    <TableCell>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img src={holding.image} alt={holding.name} width="40" height="40" />
                        <div>
                          <Typography style={{ color: "white", fontWeight: 600 }}>
                            {holding.symbol.toUpperCase()}
                          </Typography>
                          <Typography style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "0.9rem" }}>
                            {holding.name}
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="right" style={{ color: "white" }}>
                      {holding.amount}
                    </TableCell>
                    <TableCell align="right" style={{ color: "white" }}>
                      {symbol}{numberWithCommas(holding.purchasePrice.toFixed(2))}
                    </TableCell>
                    <TableCell align="right" style={{ color: "white" }}>
                      {symbol}{numberWithCommas(currentPrice.toFixed(2))}
                    </TableCell>
                    <TableCell align="right" style={{ color: "white", fontWeight: 600 }}>
                      {symbol}{numberWithCommas(marketValue.toFixed(2))}
                    </TableCell>
                    <TableCell align="right">
                      <div style={{ 
                        color: gainLoss >= 0 ? "rgb(14, 203, 129)" : "#ff6b6b",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "4px"
                      }}>
                        {gainLoss >= 0 ? <TrendingUp /> : <TrendingDown />}
                        <div>
                          {gainLoss >= 0 ? "+" : ""}{symbol}{numberWithCommas(gainLoss.toFixed(2))}
                          <br />
                          <small>({gainLoss >= 0 ? "+" : ""}{gainLossPercentage.toFixed(2)}%)</small>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => removeFromPortfolio(holding.id)}
                        style={{ color: "#ff6b6b" }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth className={classes.dialog}>
        <DialogTitle className={classes.dialogTitle}>
          Add New Holding
        </DialogTitle>
        <DialogContent style={{ background: "transparent", padding: "24px" }}>
          <FormControl fullWidth margin="normal" className={classes.textField}>
            <InputLabel style={{ color: "rgba(255, 255, 255, 0.7)" }}>Select Cryptocurrency</InputLabel>
            <Select
              value={coinId}
              onChange={(e) => setCoinId(e.target.value)}
              style={{ color: "white" }}
            >
              {coins.slice(0, 50).map((coin) => (
                <MenuItem key={coin.id} value={coin.id}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img src={coin.image} alt={coin.name} width="24" height="24" />
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={classes.textField}
          />
          <TextField
            margin="normal"
            label={`Purchase Price (${symbol})`}
            type="number"
            fullWidth
            variant="outlined"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            className={classes.textField}
          />
        </DialogContent>
        <DialogActions style={{ background: "transparent", padding: "16px 24px" }}>
          <Button onClick={() => setOpen(false)} style={{ color: "rgba(255, 255, 255, 0.7)" }}>
            Cancel
          </Button>
          <Button 
            onClick={addToPortfolio} 
            style={{ 
              background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
              color: "white",
              fontWeight: 600
            }}
          >
            Add Holding
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Portfolio;