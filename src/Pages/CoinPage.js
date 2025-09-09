import { LinearProgress, makeStyles, Typography, Button, Chip } from "@material-ui/core";
import { TrendingUp, TrendingDown, Star, StarBorder } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CoinInfo from "../components/CoinInfo";
import { SingleCoin } from "../config/api";
import { numberWithCommas } from "../components/CoinsTable";
import { CryptoState } from "../CryptoContext";

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();
  const { currency, symbol, watchlist, addToWatchlist, removeFromWatchlist } = CryptoState();

  const fetchCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (error) {
      console.error("Error fetching coin:", error);
    }
  };

  useEffect(() => {
    fetchCoin();
  }, [id]);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: "flex",
      [theme.breakpoints.down("md")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    sidebar: {
      width: "30%",
      [theme.breakpoints.down("md")]: {
        width: "100%",
      },
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: 25,
      borderRight: "2px solid rgba(255, 255, 255, 0.1)",
      background: "rgba(255, 255, 255, 0.02)",
      backdropFilter: "blur(20px)",
      padding: theme.spacing(3),
      borderRadius: "20px 0 0 20px",
    },
    coinImage: {
      width: "200px",
      height: "200px",
      marginBottom: theme.spacing(3),
      borderRadius: "50%",
      border: "4px solid rgba(0, 212, 255, 0.3)",
      padding: "10px",
      background: "rgba(255, 255, 255, 0.05)",
    },
    heading: {
      fontWeight: 800,
      marginBottom: theme.spacing(2),
      fontFamily: "'Inter', sans-serif",
      background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      textAlign: "center",
    },
    description: {
      width: "100%",
      fontFamily: "'Inter', sans-serif",
      padding: theme.spacing(3),
      paddingBottom: theme.spacing(2),
      paddingTop: 0,
      textAlign: "justify",
      color: "rgba(255, 255, 255, 0.8)",
      lineHeight: 1.6,
      fontSize: "1rem",
    },
    marketData: {
      alignSelf: "start",
      padding: theme.spacing(3),
      paddingTop: theme.spacing(1),
      width: "100%",
      [theme.breakpoints.down("md")]: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        gap: theme.spacing(2),
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "center",
      },
    },
    marketDataItem: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(2),
      padding: theme.spacing(1.5),
      background: "rgba(255, 255, 255, 0.05)",
      borderRadius: "12px",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      [theme.breakpoints.down("md")]: {
        minWidth: "200px",
      },
    },
    marketDataLabel: {
      fontWeight: 700,
      color: "rgba(255, 255, 255, 0.9)",
      fontFamily: "'Inter', sans-serif",
    },
    marketDataValue: {
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      color: "white",
      marginLeft: theme.spacing(1),
    },
    watchlistButton: {
      background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
      color: "white",
      fontWeight: 600,
      padding: theme.spacing(1.5, 3),
      borderRadius: "12px",
      marginTop: theme.spacing(2),
      width: "100%",
      "&:hover": {
        background: "linear-gradient(45deg, #00b8e6, #6a5acd)",
        transform: "translateY(-2px)",
      },
    },
    removeButton: {
      background: "linear-gradient(45deg, #ff6b6b, #ee5a52)",
      "&:hover": {
        background: "linear-gradient(45deg, #ff5252, #d32f2f)",
      },
    },
    priceChange: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "1.2rem",
      fontWeight: 700,
      marginTop: theme.spacing(1),
    },
    rankChip: {
      background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
      color: "white",
      fontWeight: 700,
      fontSize: "1rem",
      padding: theme.spacing(1, 2),
      marginBottom: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  const isInWatchlist = coin && watchlist.some(item => item.id === coin.id);

  const handleWatchlist = () => {
    if (coin) {
      if (isInWatchlist) {
        removeFromWatchlist(coin.id);
      } else {
        addToWatchlist({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol,
          image: coin.image.large,
        });
      }
    }
  };

  if (!coin) return <LinearProgress style={{ backgroundColor: "#00d4ff" }} />;

  const priceChange = coin?.market_data?.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <div className={classes.container}>
      <div className={classes.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          className={classes.coinImage}
        />
        
        <Chip 
          label={`Rank #${coin?.market_cap_rank}`} 
          className={classes.rankChip}
        />
        
        <Typography variant="h3" className={classes.heading}>
          {coin?.name}
        </Typography>
        
        <div className={classes.priceChange}>
          {isPositive ? (
            <TrendingUp style={{ color: "rgb(14, 203, 129)" }} />
          ) : (
            <TrendingDown style={{ color: "#ff6b6b" }} />
          )}
          <span style={{ color: isPositive ? "rgb(14, 203, 129)" : "#ff6b6b" }}>
            {isPositive && "+"}{priceChange?.toFixed(2)}%
          </span>
        </div>
        
        <Typography variant="subtitle1" className={classes.description}>
          <span dangerouslySetInnerHTML={{ 
            __html: coin?.description.en.split(". ")[0] + "." 
          }} />
        </Typography>
        
        <div className={classes.marketData}>
          <div className={classes.marketDataItem}>
            <Typography variant="h6" className={classes.marketDataLabel}>
              Current Price:
            </Typography>
            <Typography variant="h6" className={classes.marketDataValue}>
              {symbol} {numberWithCommas(
                coin?.market_data.current_price[currency.toLowerCase()]
              )}
            </Typography>
          </div>

          <div className={classes.marketDataItem}>
            <Typography variant="h6" className={classes.marketDataLabel}>
              Market Cap:
            </Typography>
            <Typography variant="h6" className={classes.marketDataValue}>
              {symbol} {numberWithCommas(
                coin?.market_data.market_cap[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}M
            </Typography>
          </div>

          <div className={classes.marketDataItem}>
            <Typography variant="h6" className={classes.marketDataLabel}>
              24h Volume:
            </Typography>
            <Typography variant="h6" className={classes.marketDataValue}>
              {symbol} {numberWithCommas(
                coin?.market_data.total_volume[currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}M
            </Typography>
          </div>

          <div className={classes.marketDataItem}>
            <Typography variant="h6" className={classes.marketDataLabel}>
              Circulating Supply:
            </Typography>
            <Typography variant="h6" className={classes.marketDataValue}>
              {numberWithCommas(coin?.market_data.circulating_supply?.toFixed(0))}
            </Typography>
          </div>
        </div>

        <Button
          className={`${classes.watchlistButton} ${isInWatchlist ? classes.removeButton : ""}`}
          startIcon={isInWatchlist ? <Star /> : <StarBorder />}
          onClick={handleWatchlist}
        >
          {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </Button>
      </div>
      <CoinInfo coin={coin} />
    </div>
  );
};

export default CoinPage;