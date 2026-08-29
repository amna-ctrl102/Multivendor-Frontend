import ShopLogo from "../../../Assests/ShopLogo.png";
import { AiOutlineGift } from "react-icons/ai";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { backend_url } from "../../../server";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);

  return (
    <header className="w-full h-[72px] bg-white border-b border-[#edf0f4] sticky top-0 left-0 z-50 flex items-center justify-between px-4 md:px-6">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img
          src={ShopLogo}
          alt="Shop Logo"
          className="w-[125px] md:w-[160px]"
        />
      </Link>

      {/* Right Side */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Coupon */}
        <Link
          to="/dashboard-coupouns"
          className="hidden 800px:flex w-[42px] h-[42px] rounded-xl items-center justify-center hover:bg-[#f5f7fa] transition"
          title="Discount Codes"
        >
          <AiOutlineGift size={23} className="text-[#4b5563]" />
        </Link>

        {/* Events */}
        <Link
          to="/dashboard-events"
          className="hidden 800px:flex w-[42px] h-[42px] rounded-xl items-center justify-center hover:bg-[#f5f7fa] transition"
          title="Events"
        >
          <MdOutlineLocalOffer size={23} className="text-[#4b5563]" />
        </Link>

        {/* Products */}
        <Link
          to="/dashboard-products"
          className="hidden 800px:flex w-[42px] h-[42px] rounded-xl items-center justify-center hover:bg-[#f5f7fa] transition"
          title="Products"
        >
          <FiPackage size={23} className="text-[#4b5563]" />
        </Link>

        {/* Orders */}
        <Link
          to="/dashboard-orders"
          className="hidden 800px:flex w-[42px] h-[42px] rounded-xl items-center justify-center hover:bg-[#f5f7fa] transition"
          title="Orders"
        >
          <FiShoppingBag size={23} className="text-[#4b5563]" />
        </Link>

        {/* Messages */}
        <Link
          to="/dashboard-messages"
          className="hidden 800px:flex w-[42px] h-[42px] rounded-xl items-center justify-center hover:bg-[#f5f7fa] transition"
          title="Messages"
        >
          <BiMessageSquareDetail size={23} className="text-[#4b5563]" />
        </Link>

        {/* Divider */}
        <div className="hidden 800px:block w-[1px] h-[32px] bg-[#e5e7eb] mx-3" />

        {/* Seller Profile */}
        <Link to={`/shop/${seller?._id}`}>
          <img
            src={`${backend_url}${seller?.avatar}`}
            alt="Seller"
            className="w-[45px] h-[45px] rounded-full object-cover border-2 border-[#077f9c]"
          />
        </Link>
      </div>
    </header>
  );
};

export default DashboardHeader;
