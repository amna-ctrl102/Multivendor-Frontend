import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import Loader from "../../layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { getAllOrdersOfShop } from "../../../redux/actions/order";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 180,
      flex: 1,
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.8,
      renderCell: (params) => {
        const delivered = params.value === "Delivered";

        return (
          <span
            className={`
              px-3 py-1.5
              rounded-full
              text-[12px]
              font-[600]
              ${
                delivered
                  ? "bg-[#ecfdf3] text-[#16a34a]"
                  : "bg-[#fff4e5] text-[#d97706]"
              }
            `}
          >
            {params.value}
          </span>
        );
      },
    },

    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 120,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: "action",
      headerName: "",
      minWidth: 80,
      flex: 0.4,
      sortable: false,
      filterable: false,

      renderCell: (params) => (
        <Link to={`/order/${params.id}`}>
          <Button
            sx={{
              minWidth: "38px",
              width: "38px",
              height: "38px",
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
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full min-h-[calc(100vh-72px)] p-3 sm:p-5 lg:p-8">
          <div className="w-full max-w-[1400px] mx-auto">
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
          </div>
        </div>
      )}
    </>
  );
};

export default AllOrders;
