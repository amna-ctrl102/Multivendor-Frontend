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
    0,
  );

  const serviceCharge = totalEarningWithoutTax * 0.1;

  const availableBalance = (totalEarningWithoutTax - serviceCharge).toFixed(2);
  return (
    <div className="w-full h-[calc(100vh-72px)] p-3 sm:p-5 lg:p-8 overflow-hidden">
      <div className="w-full max-w-[900px] h-full mx-auto">
        <div className="w-full h-full bg-white rounded-2xl border border-[#edf0f4] shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col items-center justify-center">
          <h5 className="text-[20px] pb-4">
            Available Balance: ${availableBalance}
          </h5>

          <button
            type="button"
            className="inline-flex items-center justify-center h-[44px] px-5 rounded-lg bg-[#077f9c] hover:bg-[#066f88] text-white text-[14px] sm:text-[15px] font-[600] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            Withdraw Your Money
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawMoney;
