import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Merchant from './pages/Merchant/Merchant';
import MerchantDetail from './pages/Merchant/MerchantDetail';
import MerchantSignup from './pages/Merchant/MerchantSignUp';
import MerchantLogin from './pages/Merchant/MerchantLogin';
import MerchantDashboard from './pages/Merchant/MerchantDashboard';
import ProtectedMerchantRoute from './components/Protected/ProtectedMerchantRoute';
import { MerchantProvider } from './context/MerchantContext';
import { Navigate } from "react-router-dom";
import PaymentPage from './pages/PaymentPage/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess/PaymentSuccess';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isMerchantLogin, setIsMerchantLogin] = useState(false);

  return (
    <MerchantProvider>
      {showLogin && (
        <LoginPopup
          setShowLogin={setShowLogin}
          isMerchant={isMerchantLogin}
        />
      )}

      <div className="app">
        <Navbar
          setShowLogin={setShowLogin}
          setIsMerchantLogin={setIsMerchantLogin}
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/merchants" element={<Merchant />} />
          <Route path="/merchants/:id" element={<MerchantDetail />} />
          <Route path="/merchant/signup" element={<MerchantSignup url="http://localhost:4000" />} />
          <Route
            path="/merchant/login"
            element={
              localStorage.getItem("merchantToken") ? (
                <Navigate to="/merchant/dashboard" replace />
              ) : (
                <MerchantLogin url="http://localhost:4000" />
              )
            }
          />
          <Route
            path="/merchant/dashboard"
            element={
              <ProtectedMerchantRoute>
                <MerchantDashboard url="http://localhost:4000" />
              </ProtectedMerchantRoute>
            }
          />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
        </Routes>
      </div>

      <Footer />
    </MerchantProvider>
  );
};

export default App;
