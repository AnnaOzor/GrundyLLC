// src/context/MerchantContext.jsx
import { createContext, useState } from "react";

export const MerchantContext = createContext(null);

export const MerchantProvider = ({ children }) => {
  const [merchantToken, setMerchantToken] = useState(localStorage.getItem("merchantToken") || "");
  const [merchantId, setMerchantId] = useState(localStorage.getItem("merchantId") || null);

  const loginMerchant = (token, id) => {
    localStorage.setItem("merchantToken", token);
    localStorage.setItem("merchantId", id);
    setMerchantToken(token);
    setMerchantId(id);
  };

  const logoutMerchant = () => {
    localStorage.removeItem("merchantToken");
    localStorage.removeItem("merchantId");
    setMerchantToken("");
    setMerchantId(null);
  };

  const isAuthenticated = !!merchantToken && !!merchantId;

  return (
    <MerchantContext.Provider
      value={{
        merchantToken,
        merchantId,
        isAuthenticated,
        loginMerchant,
        logoutMerchant,
      }}
    >
      {children}
    </MerchantContext.Provider>
  );
};
