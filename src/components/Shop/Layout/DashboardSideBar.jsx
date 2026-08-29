import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSideBar = ({ active }) => {
  const menuItems = [
    {
      id: 1,
      label: "Dashboard",
      icon: RxDashboard,
      link: "/dashboard",
    },
    {
      id: 2,
      label: "All Orders",
      icon: FiShoppingBag,
      link: "/dashboard-orders",
    },
    {
      id: 3,
      label: "All Products",
      icon: FiPackage,
      link: "/dashboard-products",
    },
    {
      id: 4,
      label: "Create Product",
      icon: AiOutlineFolderAdd,
      link: "/dashboard-create-product",
    },
    {
      id: 5,
      label: "All Events",
      icon: MdOutlineLocalOffer,
      link: "/dashboard-events",
    },
    {
      id: 6,
      label: "Create Event",
      icon: VscNewFile,
      link: "/dashboard-create-events",
    },
    {
      id: 7,
      label: "Withdraw Money",
      icon: CiMoneyBill,
      link: "/dashboard-withdraw-money",
    },
    {
      id: 8,
      label: "Shop Inbox",
      icon: BiMessageSquareDetail,
      link: "/dashboard-messages",
    },
    {
      id: 9,
      label: "Discount Codes",
      icon: AiOutlineGift,
      link: "/dashboard-coupouns",
    },
    {
      id: 10,
      label: "Refunds",
      icon: HiOutlineReceiptRefund,
      link: "/dashboard-refunds",
    },
    {
      id: 11,
      label: "Settings",
      icon: CiSettings,
      link: "/settings",
    },
  ];

  return (
    <aside className="w-full h-[calc(100vh-72px)] bg-white border-r border-[#edf0f4] sticky top-[72px] left-0 overflow-y-auto hide-scrollbar hide-scrollbar::-webkit-scrollbar">
      <nav className="px-2 800px:px-3 pb-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <Link
              key={item.id}
              to={item.link}
              className={`
                relative w-full flex items-center
                h-[52px]
                px-3 800px:px-4
                mb-1
                rounded-xl
                transition-all duration-200
                group
                ${
                  isActive
                    ? "bg-[#fff1f3] text-[#077f9c]"
                    : "text-[#64748b] hover:bg-[#f8fafc] hover:text-[#077f9c]"
                }
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <span className="absolute left-0 top-[11px] w-[4px] h-[30px] rounded-r-full bg-[#077f9c]" />
              )}

              <Icon
                size={23}
                className={`
                  shrink-0 transition-colors
                  ${
                    isActive
                      ? "text-[#077f9c]"
                      : "text-[#64748b] group-hover:text-[#077f9c]"
                  }
                `}
              />

              <span
                className={`
                  hidden 800px:block
                  ml-3
                  text-[14px]
                  font-[500]
                  whitespace-nowrap
                  ${
                    isActive
                      ? "text-[#077f9c]"
                      : "text-[#475569]"
                  }
                `}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSideBar;