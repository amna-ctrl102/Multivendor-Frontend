import { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import { Link } from "react-router-dom";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersOfShop } from "../../../redux/actions/order";
import { getAllProductsShop } from "../../../redux/actions/product";

const DashboardHero = () => {
  const dispatch = useDispatch();

  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const [deliveredOrder, setDeliveredOrder] = useState([]);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
      dispatch(getAllProductsShop(seller._id));
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

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 170,
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      renderCell: (params) => (
        <span
          className={`
            px-3 py-1.5 rounded-full text-[12px] font-[600]
            ${
              params.value === "Delivered"
                ? "bg-[#ecfdf3] text-[#16a34a]"
                : "bg-[#fff4e5] text-[#d97706]"
            }
          `}
        >
          {params.value}
        </span>
      ),
    },

    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 110,
      flex: 0.6,
    },

    {
      field: "total",
      headerName: "Total",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "action",
      headerName: "",
      minWidth: 90,
      flex: 0.4,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Link to={`/dashboard/order/${params.id}`}>
          <Button
            sx={{
              minWidth: "40px",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              color: "#077f9c",
              backgroundColor: "#effbfc",
              "&:hover": {
                backgroundColor: "#dff5f7",
              },
            }}
          >
            <AiOutlineArrowRight size={19} />
          </Button>
        </Link>
      ),
    },
  ];

  const row = [];

  orders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.length,
      total: "US$ " + item.totalPrice,
      status: item.status,
    });
  });

  return (
    <div className="w-full max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8">
      {/* Page Heading */}
      <div className="mb-7">
        <p className="text-[13px] font-[500] text-[#077f9c] uppercase tracking-wider">
          Seller Dashboard
        </p>

        <h1 className="mt-1 text-[26px] sm:text-[30px] font-[700] text-[#1f2937]">
          Overview
        </h1>

        <p className="mt-1 text-[14px] text-[#94a3b8]">
          Monitor your store performance and recent activity.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 1100px:grid-cols-3 gap-5">
        {/* Balance */}
        <div className="relative overflow-hidden bg-white border border-[#edf0f4] rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[14px] font-[500] text-[#94a3b8]">
                Account Balance
              </p>

              <h2 className="mt-3 text-[30px] font-[700] text-[#1e293b]">
                ${availableBalance}
              </h2>
            </div>

            <div className="w-[50px] h-[50px] rounded-xl bg-[#e8f7fa] flex items-center justify-center">
              <AiOutlineMoneyCollect size={26} className="text-[#077f9c]" />
            </div>
          </div>

          <div className="mt-2">
            <span className="text-[12px] text-[#94a3b8]">
              10% service charge deducted
            </span>
          </div>

          <Link to="/dashboard-withdraw-money">
            <div className="mt-5 inline-flex items-center text-[14px] font-[600] text-[#077f9c] hover:gap-2 transition-all">
              Withdraw Money
              <span className="ml-1">→</span>
            </div>
          </Link>
        </div>

        {/* Orders */}
        <div className="relative overflow-hidden bg-white border border-[#edf0f4] rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[14px] font-[500] text-[#94a3b8]">
                All Orders
              </p>

              <h2 className="mt-3 text-[30px] font-[700] text-[#1e293b]">
                {orders?.length || 0}
              </h2>
            </div>

            <div className="w-[50px] h-[50px] rounded-xl bg-[#fff5e8] flex items-center justify-center">
              <FiShoppingBag size={25} className="text-[#f59e0b]" />
            </div>
          </div>

          <p className="mt-2 text-[12px] text-[#94a3b8]">
            Total orders received
          </p>

          <Link to="/dashboard-orders">
            <div className="mt-5 inline-flex items-center text-[14px] font-[600] text-[#077f9c]">
              View Orders
              <span className="ml-1">→</span>
            </div>
          </Link>
        </div>

        {/* Products */}
        <div className="relative overflow-hidden bg-white border border-[#edf0f4] rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[14px] font-[500] text-[#94a3b8]">
                All Products
              </p>

              <h2 className="mt-3 text-[30px] font-[700] text-[#1e293b]">
                {products?.length || 0}
              </h2>
            </div>

            <div className="w-[50px] h-[50px] rounded-xl bg-[#eef2ff] flex items-center justify-center">
              <FiPackage size={25} className="text-[#6366f1]" />
            </div>
          </div>

          <p className="mt-2 text-[12px] text-[#94a3b8]">
            Products currently listed
          </p>

          <Link to="/dashboard-products">
            <div className="mt-5 inline-flex items-center text-[14px] font-[600] text-[#077f9c]">
              View Products
              <span className="ml-1">→</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Latest Orders */}
      <section className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-[21px] font-[650] text-[#1e293b]">
              Latest Orders
            </h2>

            <p className="mt-1 text-[13px] text-[#94a3b8]">
              Recently placed orders from your store
            </p>
          </div>

          <Link to="/dashboard-orders">
            <button className="text-[13px] font-[600] text-[#077f9c] hover:underline">
              View All Orders →
            </button>
          </Link>
        </div>

        <div className="w-full bg-white border border-[#edf0f4] rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.04)]">
          <div className="w-full overflow-x-auto 800px:overflow-x-hidden">
            <div className="min-w-[700px] 800px:min-w-0">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
                sx={{
                  border: "none",

                  "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#f8fafc",
                    borderBottom: "1px solid #edf0f4",
                    color: "#475569",
                    fontWeight: 600,
                  },

                  "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: 600,
                    fontSize: "15px",
                  },

                  "& .MuiDataGrid-cell": {
                    borderBottom: "1px solid #f1f5f9",
                    color: "#475569",
                    fontSize: "13px",
                  },

                  "& .MuiDataGrid-row:hover": {
                    backgroundColor: "#f8fbfc",
                  },

                  "& .MuiDataGrid-footerContainer": {
                    borderTop: "1px solid #edf0f4",
                  },

                  "& .MuiTablePagination-root": {
                    color: "#64748b",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardHero;
