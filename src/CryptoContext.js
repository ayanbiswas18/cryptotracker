import React, { createContext, useContext, useEffect, useState } from "react";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
    else if (currency === "EUR") setSymbol("€");
  }, [currency]);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem("cryptovault-watchlist");
    if (savedWatchlist) {
      setWatchlist(JSON.parse(savedWatchlist));
    }
  }, []);

  const addToWatchlist = (coin) => {
    const newWatchlist = [...watchlist, coin];
    setWatchlist(newWatchlist);
    localStorage.setItem("cryptovault-watchlist", JSON.stringify(newWatchlist));
  };

  const removeFromWatchlist = (coinId) => {
    const newWatchlist = watchlist.filter(coin => coin.id !== coinId);
    setWatchlist(newWatchlist);
    localStorage.setItem("cryptovault-watchlist", JSON.stringify(newWatchlist));
  };

  return (
    <Crypto.Provider value={{ 
      currency, 
      setCurrency, 
      symbol,
      watchlist,
      addToWatchlist,
      removeFromWatchlist
    }}>
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};