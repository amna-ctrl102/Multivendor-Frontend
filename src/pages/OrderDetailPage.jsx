import React from 'react'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import UserOrderDetails from "../components/UserOrderDetails/UserOrderDetails";

const OrderDetailPage = () => {
  return (
    <div>
          <Header />
          <UserOrderDetails/>
          <Footer/>
        </div>
  )
}

export default OrderDetailPage
