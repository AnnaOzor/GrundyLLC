import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying payment...");
  const reference = searchParams.get("reference"); // Paystack transaction reference

  useEffect(() => {
    if (reference) {
      axios
        .get(`https://marco-crescive-vowely.ngrok-free.dev/api/paystack/verify/${reference}`)
        .then((res) => {
          if (res.data.status) {
            setStatus("Payment successful! 🎉");
          } else {
            setStatus("Payment failed or not verified.");
          }
        })
        .catch((err) => {
          console.error(err);
          setStatus("Error verifying payment.");
        });
    } else {
      setStatus("No payment reference provided.");
    }
  }, [reference]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>{status}</h1>
    </div>
  );
};

export default PaymentSuccess;
