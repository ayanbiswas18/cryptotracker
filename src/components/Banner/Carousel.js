import { makeStyles, Typography } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { useNavigate } from "react-router-dom";
import { TrendingCoins } from "../../config/api";
import { CryptoState } from "../../CryptoContext";
import { numberWithCommas } from "../CoinsTable";
import { TrendingUp, TrendingDown } from "@material-ui/icons";

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const { currency, symbol } = CryptoState();
  const navigate = useNavigate();

  const fetchTrendingCoins = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);
    } catch (error) {
      console.error("Error fetching trending coins:", error);
    }
  };

  useEffect(() => {
    fetchTrendingCoins();
  }, [currency]);

  const useStyles = makeStyles((theme) => ({
    carousel: {
      height: "50%",
      display: "flex",
      alignItems: "center",
    },
    carouselItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      cursor: "pointer",
      textTransform: "uppercase",
      color: "white",
      padding: theme.spacing(2),
      margin: theme.spacing(0, 1),
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(20px)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "20px",
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "translateY(-8px) scale(1.05)",
        boxShadow: "0 20px 40px rgba(0, 212, 255, 0.3)",
        border: "1px solid rgba(0, 212, 255, 0.5)",
      },
    },
    coinImage: {
      width: "80px",
      height: "80px",
      marginBottom: theme.spacing(1),
      borderRadius: "50%",
      border: "3px solid rgba(255, 255, 255, 0.1)",
      transition: "all 0.3s ease",
    },
    coinSymbol: {
      fontSize: "1.2rem",
      fontWeight: 700,
      marginBottom: theme.spacing(0.5),
      fontFamily: "'Inter', sans-serif",
    },
    priceChange: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      fontSize: "0.9rem",
      fontWeight: 600,
      marginBottom: theme.spacing(0.5),
    },
    price: {
      fontSize: "1.1rem",
      fontWeight: 600,
      color: "#00d4ff",
    },
    sectionTitle: {
      textAlign: "center",
      marginBottom: theme.spacing(3),
      fontSize: "2rem",
      fontWeight: 700,
      background: "linear-gradient(45deg, #00d4ff, #7b68ee)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
      fontFamily: "'Inter', sans-serif",
    },
  }));

  const classes = useStyles();

  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    return (
      <div 
        className={classes.carouselItem} 
        onClick={() => navigate(`/coins/${coin.id}`)}
        key={coin.id}
      >
        <img
          src={coin?.image}
          alt={coin.name}
          className={classes.coinImage}
        />
        <Typography className={classes.coinSymbol}>
          {coin?.symbol}
        </Typography>
        <div className={classes.priceChange}>
          {profit ? <TrendingUp style={{ color: "rgb(14, 203, 129)" }} /> : <TrendingDown style={{ color: "#ff6b6b" }} />}
          <span
            style={{
              color: profit ? "rgb(14, 203, 129)" : "#ff6b6b",
              fontWeight: 600,
            }}
          >
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}%
          </span>
        </div>
        <Typography className={classes.price}>
          {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
        </Typography>
      </div>
    );
  });

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 3,
    },
    1024: {
      items: 4,
    },
  };

  return (
    <div>
      <Typography className={classes.sectionTitle}>
        🔥 Trending Cryptocurrencies
      </Typography>
      <div className={classes.carousel}>
        <AliceCarousel
          mouseTracking
          infinite
          autoPlayInterval={2000}
          animationDuration={1500}
          disableDotsControls
          disableButtonsControls
          responsive={responsive}
          items={items}
          autoPlay
        />
      </div>
    </div>
  );
};

export default Carousel;