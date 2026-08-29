import React from "react";
import Header from "../components/layout/Header";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Checkout from "../components/Checkout/Checkout";
import Footer from "../components/layout/Footer";

const CheckoutPage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Header />

      <div className="h-4 sm:h-6 md:h-8" />

      <CheckoutSteps active={1} />

      <Checkout />

      <div className="h-6 sm:h-8 md:h-10" />

      <Footer />
    </div>
  );
};

export default CheckoutPage;
