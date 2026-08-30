import CheckoutSteps from '../components/Checkout/CheckoutSteps'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import Payment from "../components/Payment/Payment";

const PaymentPage = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <Header />

      <div className="h-4 sm:h-6 md:h-8" />

      <CheckoutSteps active={2} />

      <Payment />

      <div className="h-6 sm:h-8 md:h-10" />

      <Footer />
    </div>
  )
}

export default PaymentPage