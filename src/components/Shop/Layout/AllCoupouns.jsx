import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineDelete } from "react-icons/ai";
import { Button } from "@mui/material";
import Loader from "../../layout/Loader";
import { DataGrid } from "@mui/x-data-grid";
import { RxCross1 } from "react-icons/rx";
import { server } from "../../../server";
import axios from "axios";
import { toast } from "react-toastify";

const AllCoupouns = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [coupouns, setCoupouns] = useState([]);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    const getCoupouns = async () => {
      try {
        const res = await axios.get(
          `${server}/coupoun/get-coupoun/${seller._id}`,
          {
            withCredentials: true,
          },
        );
        setIsLoading(false);
        setCoupouns(res.data.coupounCode || []);
      } catch (error) {
        setIsLoading(false);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      }
    };
    getCoupouns();
  }, [dispatch, seller?._id]);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`${server}/coupoun/delete-coupoun/${id}`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${server}/coupoun/create-coupoun-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
          shop: seller,
        },
        {
          withCredentials: true,
        },
      );
      setOpen(false);
      console.log(res.data.message);
      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
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
      headerName: "Value",
      minWidth: 100,
      flex: 0.6,
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

  coupouns &&
    coupouns.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + " %",
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="w-full flex justify-end px-3 sm:px-5 lg:px-8 pt-4">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center justify-center h-[44px] px-5 rounded-lg bg-[#077f9c] hover:bg-[#066f88] text-white text-[14px] sm:text-[15px] font-[600] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              Create Coupon Code
            </button>
          </div>
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
          {open && (
            <div className="fixed inset-0 z-[20000] bg-black/50 flex items-center justify-center p-3 sm:p-5">
              <div className="w-full max-w-[650px] max-h-[95vh] bg-white rounded-2xl border border-[#edf0f4] shadow-[0_10px_40px_rgba(15,23,42,0.15)] overflow-hidden">
                {/* Header */}
                <div className="px-5 sm:px-7 py-5 border-b border-[#edf0f4] flex items-center justify-between">
                  <div>
                    <h5 className="text-[22px] sm:text-[26px] font-Poppins font-[600] text-[#1f2937]">
                      Create Coupon Code
                    </h5>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-[38px] h-[38px] rounded-lg flex -center justify-center text-[#64748b] hover:text-[#1f2937] hover:bg-[#f1f5f9] transition "
                  >
                    <RxCross1 size={20} />
                  </button>
                </div>

                {/* Form Scroll Area */}
                <div className="max-h-[calc(95vh-100px)] overflow-y-auto px-5 sm:px-7 py-6">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                      <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="text"
                        name="name"
                        required
                        value={name}
                        placeholder="Enter your coupon code name..."
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                      />
                    </div>

                    {/* Discount */}
                    <div>
                      <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                        Discount Percentage{" "}
                        <span className="text-red-500">*</span>
                      </label>

                      <input
                        type="number"
                        name="value"
                        required
                        value={value}
                        placeholder="Enter discount percentage..."
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                      />
                    </div>

                    {/* Min / Max */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                          Min Amount
                        </label>

                        <input
                          type="number"
                          name="minAmount"
                          value={minAmount}
                          placeholder="Minimum amount..."
                          onChange={(e) => setMinAmount(e.target.value)}
                          className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                        />
                      </div>

                      <div>
                        <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                          Max Amount
                        </label>

                        <input
                          type="number"
                          name="maxAmount"
                          value={maxAmount}
                          placeholder="Maximum amount..."
                          onChange={(e) => setMaxAmount(e.target.value)}
                          className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                        />
                      </div>
                    </div>

                    {/* Selected Products */}
                    <div>
                      <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                        Selected Product
                      </label>

                      <select
                        value={selectedProducts}
                        onChange={(e) => setSelectedProducts(e.target.value)}
                        className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] bg-white outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                      >
                        <option value="Choose your selected products">
                          Choose a selected product
                        </option>

                        {products &&
                          products.map((i) => (
                            <option value={i.name} key={i.name}>
                              {i.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        className="w-full h-[48px] rounded-lg bg-[#077f9c] hover:bg-[#066f88] text-white text-[15px] font-[600] transition duration-200 shadow-sm hover:shadow-md"
                      >
                        Create Coupon
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default AllCoupouns;
