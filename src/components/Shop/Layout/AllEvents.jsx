import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteEvent, getAllEventsShop } from "../../../redux/actions/event";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import Loader from "../../layout/Loader";
import { DataGrid } from "@mui/x-data-grid";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllEventsShop(seller._id));
  }, [dispatch, seller._id]);

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    window.location.reload();
  };

  const columns = [
    {
      field: "id",
      headerName: "Product Id",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: "Stock",
      headerName: "Stock",
      type: "number",
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: "Sold",
      headerName: "Sold out",
      type: "number",
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: "Preview",
      flex: 0.8,
      minWidth: 100,
      headerName: "Preview",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, "-");
        return (
          <>
            <Link to={`/product/${product_name}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "Delete",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  const row = [];

  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.discountPrice
          ? "US$ " + item.discountPrice
          : "US$ " + item.originalPrice,
        Stock: item.stock,
        Sold: 10,
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
              {/* Mobile par horizontal scroll */}
              <div className="w-full overflow-x-auto min-[800px]:overflow-x-hidden">
                <div className="min-w-[860px] min-[800px]:min-w-0">
                  <DataGrid
                    rows={row}
                    columns={columns}
                    pageSize={10}
                    disableSelectionOnClick
                    autoHeight
                    sx={{
                      border: "none",
                      width: "100%",

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

export default AllEvents;
