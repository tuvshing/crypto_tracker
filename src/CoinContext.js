import React, { createContext, useContext, useEffect, useState } from "react";

const Cryptocurrency = createContext();

const CoinContext = ({ children }) => {
  const [curr, setCurr] = useState("CAD");
  const [sym, setSym] = useState("$");
  useEffect(() => {
    setSym("$");
  }, [curr]);

  return (
    <Cryptocurrency.Provider value={{ curr, sym, setCurr }}>
      {children}
    </Cryptocurrency.Provider>
  );
};

export default CoinContext;
export const CryptoState = () => {
  return useContext(Cryptocurrency);
};
