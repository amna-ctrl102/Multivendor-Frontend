import { BsFillBagFill } from "react-icons/bs";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaCalendarAlt,
  FaBoxOpen,
} from "react-icons/fa";
import styles from "../../../styles/styles";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllOrdersOfShop } from "../../../redux/actions/order";
import {
  getAllProducts,
  getAllProductsShop,
} from "../../../redux/actions/product";
import { backend_url, server } from "../../../server";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const [status, setStatus] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const data = orders && orders.find((item) => item._id === id);

  const paymentStatus = data?.paymentInfo?.status || "Not Paid";

  // Order Status Update
  const orderStatusUpdateHandler = async () => {
    try {
      const res = await axios.put(
        `${server}/order/update-order-status/${id}`,
        {
          status,
        },
        {
          withCredentials: true,
        },
      );

      dispatch(getAllProducts());

      if (seller?._id) {
        dispatch(getAllProductsShop(seller._id));
      }

      toast.success(res.data.message);
      navigate("/dashboard-orders");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Refund Status Update
  const refundOrderStatusUpdateHandler = async () => {
    try {
      const res = await axios.put(
        `${server}/order/order-refund-success/${id}`,
        {
          status,
        },
        {
          withCredentials: true,
        },
      );

      dispatch(getAllProducts());

      if (seller?._id) {
        dispatch(getAllProductsShop(seller._id));
      }

      toast.success(res.data.message);
      dispatch(getAllOrdersOfShop(seller._id));
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  return (
    <div className={`py-6 min-h-screen ${styles.section}`}>
      {/* ================= HEADER ================= */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Heading */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#f8e8f1] flex items-center justify-center">
              <BsFillBagFill size={23} color="#a30563" />
            </div>

            <div>
              <h1 className="text-[24px] md:text-[28px] font-[700] text-[#222]">
                Order Details
              </h1>

              <p className="text-[14px] text-gray-500">
                View complete information about this order
              </p>
            </div>
          </div>

          {/* Order List Button */}
          <Link to="/dashboard-orders">
            <div
              className={`${styles.button} !bg-[#a30563] hover:!bg-[#85004f] !rounded-lg !h-[44px] px-5 text-white font-[600] text-[16px] flex items-center justify-center transition`}
            >
              Order List
            </div>
          </Link>
        </div>
      </div>

      {/* ================= ORDER INFO ================= */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 mt-7 p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Order ID */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FaBoxOpen className="text-gray-600" />
            </div>

            <div>
              <p className="text-[13px] text-gray-500">Order ID</p>

              <p className="text-[16px] font-[600] text-[#222]">
                #{data?._id?.slice(0, 8)}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FaCalendarAlt className="text-gray-600" />
            </div>

            <div>
              <p className="text-[13px] text-gray-500">Placed On</p>

              <p className="text-[16px] font-[600] text-[#222]">
                {data?.createdAt?.slice(0, 10)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ORDER ITEMS HEADING ================= */}
      <div className="flex items-center gap-2 mb-5 mt-10">
        <FaBoxOpen className="text-[#a30563]" size={20} />

        <h2 className="text-[20px] font-[700] text-[#222]">
          Order Items
        </h2>
      </div>

      {/* ================= ORDER ITEMS ================= */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 mt-5 p-5 md:p-6">
        <div className="space-y-4">
          {data &&
            data?.cart.map((item, index) => (
              <div
                key={index}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#fafafa] border border-gray-100 hover:shadow-sm transition"
              >
                {/* Product Image */}
                <div className="w-[80px] h-[80px] rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <img
                    src={`${backend_url}${item?.images[0]}`}
                    alt={item?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h5 className="text-[17px] md:text-[19px] font-[600] text-[#222] truncate">
                    {item.name}
                  </h5>

                  <p className="text-[15px] text-gray-500 mt-1">
                    US$
                    {item.discountPrice
                      ? item.discountPrice
                      : item.originalPrice}

                    <span className="mx-2">×</span>

                    {item.qty}
                  </p>
                </div>

                {/* Item Total */}
                <div className="text-right hidden sm:block">
                  <p className="text-[13px] text-gray-500">
                    Item Total
                  </p>

                  <p className="text-[17px] font-[700] text-[#222]">
                    US$
                    {(item.discountPrice
                      ? item.discountPrice
                      : item.originalPrice) * item.qty}
                  </p>
                </div>
              </div>
            ))}
        </div>

        {/* ================= TOTAL ================= */}
        <div className="border-t border-gray-200 mt-6 pt-5 flex justify-between items-center">
          <h3 className="text-[17px] md:text-[19px] font-[600] text-gray-600">
            Total Price
          </h3>

          <h3 className="text-[22px] md:text-[24px] font-[700] text-[#a30563]">
            US${data?.totalPrice}
          </h3>
        </div>
      </div>

      {/* ================= SHIPPING + PAYMENT ================= */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10 items-stretch">
        {/* ================= SHIPPING ADDRESS ================= */}
        <div className="w-full flex flex-col">
          {/* Heading */}
          <div className="flex items-center gap-2 mb-5">
            <FaMapMarkerAlt
              className="text-[#a30563]"
              size={20}
            />

            <h2 className="text-[20px] font-[700] text-[#222]">
              Shipping Address
            </h2>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 flex-1">
            <div className="space-y-4">
              {/* Address */}
              <div>
                <p className="text-[13px] text-gray-500 mb-1">
                  Address
                </p>

                <p className="text-[16px] font-[500] text-[#333]">
                  {data?.shippingAddress?.address1
                    ? data?.shippingAddress?.address1
                    : data?.shippingAddress?.address2}
                </p>
              </div>

              {/* Country */}
              <div>
                <p className="text-[13px] text-gray-500 mb-1">
                  Country
                </p>

                <p className="text-[16px] font-[500] text-[#333]">
                  {data?.shippingAddress?.country}
                </p>
              </div>

              {/* City */}
              <div>
                <p className="text-[13px] text-gray-500 mb-1">
                  City
                </p>

                <p className="text-[16px] font-[500] text-[#333]">
                  {data?.shippingAddress?.city}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-[13px] text-gray-500 mb-1">
                  Phone
                </p>

                <p className="text-[16px] font-[500] text-[#333]">
                  {data?.user?.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PAYMENT INFORMATION ================= */}
        <div className="w-full flex flex-col">
          {/* Heading */}
          <div className="flex items-center gap-2 mb-5">
            <FaCreditCard className="text-blue-500" size={20} />

            <h2 className="text-[20px] font-[700] text-[#222]">
              Payment Information
            </h2>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 flex-1">
            <div className="space-y-5">
              {/* Payment Status */}
              <div>
                <p className="text-[13px] text-gray-500 mb-2">
                  Payment Status
                </p>

                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-[600] ${
                    paymentStatus === "succeeded"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <FaCheckCircle size={14} />

                  {paymentStatus}
                </span>
              </div>

              {/* Payment Method */}
              <div>
                <p className="text-[13px] text-gray-500">
                  Payment Method
                </p>

                <p className="text-[16px] font-[600] text-[#333] mt-1">
                  {data?.paymentInfo?.type || "Not Available"}
                </p>
              </div>

              {/* Payment ID */}
              <div>
                <p className="text-[13px] text-gray-500">
                  Payment ID
                </p>

                <p className="text-[14px] font-[500] text-[#555] mt-1 break-all">
                  {data?.paymentInfo?.id || "Not Available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ORDER STATUS ================= */}
      <div className="w-full mt-10">
        {/* Heading */}
        <div className="flex items-center gap-2 mb-5">
          <FaBoxOpen
            className="text-[#a30563]"
            size={20}
          />

          <h2 className="text-[20px] font-[700] text-[#222]">
            Order Status
          </h2>
        </div>

        {/* Status Card */}
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
          <div className="w-full">
            <label className="block text-[14px] font-[600] text-gray-600 mb-2">
              {data?.status === "Processing refund" ||
              data?.status === "Refund Success"
                ? "Refund Status"
                : "Current Status"}
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              {/* Select */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full sm:w-[320px] h-[45px] px-3 border border-gray-200 rounded-lg bg-[#fafafa] text-[15px] text-[#333] outline-none focus:border-[#a30563] focus:ring-1 focus:ring-[#a30563] transition cursor-pointer"
              >
                {data?.status === "Processing refund" ||
                data?.status === "Refund Success"
                  ? ["Processing refund", "Refund Success"]
                      .slice(
                        [
                          "Processing refund",
                          "Refund Success",
                        ].indexOf(data?.status),
                      )
                      .map((option, index) => (
                        <option
                          value={option}
                          key={index}
                        >
                          {option}
                        </option>
                      ))
                  : [
                      "Processing",
                      "Transferred to delivery partner",
                      "Shipping",
                      "Received",
                      "On the way",
                      "Delivered",
                    ]
                      .slice(
                        [
                          "Processing",
                          "Transferred to delivery partner",
                          "Shipping",
                          "Received",
                          "On the way",
                          "Delivered",
                        ].indexOf(data?.status),
                      )
                      .map((option, index) => (
                        <option
                          value={option}
                          key={index}
                        >
                          {option}
                        </option>
                      ))}
              </select>

              {/* Update Button */}
              <div
                className={`${styles.button} !w-full sm:!w-[160px] !h-[45px] !bg-[#a30563] hover:!bg-[#85004f] !rounded-lg text-white font-[600] text-[16px] flex items-center justify-center cursor-pointer transition`}
                onClick={
                  data?.status === "Processing refund"
                    ? refundOrderStatusUpdateHandler
                    : orderStatusUpdateHandler
                }
              >
                Update Status
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />
    </div>
  );
};

export default OrderDetails;