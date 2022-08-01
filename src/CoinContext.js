import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import CoinList from "./components/CoinList";
import { auth, db } from "./firebase";
import axios from "axios";
import { CryptoList } from "./config/api";

const Cryptocurrency = createContext();

const CoinContext = ({ children }) => {
  const [curr, setCurr] = useState("CAD");
  const [sym, setSym] = useState("$");
  const [user, setUser] = useState(null)
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    type:'success'
  })
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user?.uid);
      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          console.log(coin.data().coins);
          setWatchlist(coin.data().coins);
        } else {
          console.log("No Items in Watchlist");
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);
  


  useEffect(() => {
    onAuthStateChanged(auth, user=>{
      if(user) setUser(user)
      else setUser(null)
    })
  }, [])

  useEffect(() => {
    setSym("$");
    const fetchCoins = async () => {
      setLoading(true);
      const { data } = await axios.get(CryptoList(curr));
      setCoins(data);
      setLoading(false);
    };
    fetchCoins()
  }, [curr])

  return (
    <Cryptocurrency.Provider value={{ curr, sym, setCurr, alert, setAlert, user, coins, loading, watchlist }}>
      {children}
    </Cryptocurrency.Provider>
  );
};

export default CoinContext;
export const CryptoState = () => {
  return useContext(Cryptocurrency);
};
