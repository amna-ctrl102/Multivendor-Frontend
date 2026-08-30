import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../../redux/actions/order";

const WithdrawMoney = () => {
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const [deliveredOrder, setDeliveredOrder] = useState([]);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  useEffect(() => {
    const orderData =
      orders?.filter((item) => item.status === "Delivered") || [];

    setDeliveredOrder(orderData);
  }, [orders]);

  const totalEarningWithoutTax = deliveredOrder.reduce(
    (acc, item) => acc + Number(item.totalPrice || 0),
    0
  );

  const serviceCharge = totalEarningWithoutTax * 0.1;

  const availableBalance = (
    totalEarningWithoutTax - serviceCharge
  ).toFixed(2);

  return (
    <div className="w-full min-h-[calc(100vh-72px)] px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">
      <div className="w-full max-w-[900px] min-h-[calc(100vh-104px)] sm:min-h-[calc(100vh-120px)] mx-auto">
        
        <div className="w-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-white rounded-xl sm:rounded-2xl border border-[#edf0f4] shadow-[0_4px_20px_rgba(15,23,42,0.05)] flex flex-col items-center justify-center px-4 sm:px-8 py-10 text-center">
          
          {/* Balance */}
          <h5 className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium text-gray-800 mb-5 sm:mb-6 break-words">
            Available Balance:{" "}
            <span className="font-semibold text-[#077f9c]">
              ${availableBalance}
            </span>
          </h5>

          {/* Withdraw Button */}
          <button
            type="button"
            className="w-full max-w-[260px] sm:w-auto inline-flex items-center justify-center min-h-[44px] sm:min-h-[46px] px-5 sm:px-6 rounded-lg bg-[#077f9c] hover:bg-[#066f88] text-white text-sm sm:text-[15px] font-semibold shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            Withdraw Your Money
          </button>

        </div>
      </div>
    </div>
  );
};

export default WithdrawMoney;