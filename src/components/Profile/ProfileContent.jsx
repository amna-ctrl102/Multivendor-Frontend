import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import styles from "../../styles/styles";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineTrackChanges } from "react-icons/md";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  deleteUserAddress,
  loadUser,
  updateUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import axios from "axios";
import { RxCross1 } from "react-icons/rx";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setPhoneNumber(user.phoneNumber ?? "");
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserInformation(name, email, phoneNumber, password));
      toast.success("User updated successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.put(`${server}/user/update-avatar`, formData, {
        withCredentials: true,
      });
      console.log(res.data);
      dispatch(loadUser());
      toast.success("Avatar Updated Successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-[10px] p-4 pt-6 mt-16 800px:mt-0">
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={user?.avatar || " "}
                alt="profileImage"
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-[3px] border-[#a30563]"
              />
              <div className="w-[40px] h-[40px] bg-[#a30563] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  name="image"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image">
                  <AiOutlineCamera size={25} color="white" />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full md:px-5">
            <form onSubmit={handleSubmit}>
              <div className="w-full flex flex-col md:flex-row gap-5 md:gap-10">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563]`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="email"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563] mb-6 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row gap-5 md:gap-10 md:mt-5">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="text"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563]`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Enter Your Password </label>
                  <input
                    type="password"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563] mb-6 800px:mb-0`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-8 mb-7">
                <button
                  className="w-full sm:w-[320px] h-12 flex items-center justify-center bg-black hover:bg-gray-800 transition text-white rounded-lg uppercase font-semibold shadow-lg disabled:opacity-80"
                  type="submit"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {/* order section */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}
      {active === 5 && (
        <div>
          <TrackOrders />
        </div>
      )}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [user, dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
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
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div>
      <h1 className="text-[25px] font-[600] text-black pb-2">
        My Orders
      </h1>
      <div className="w-full overflow-x-auto pt-2">
        <div style={{ minWidth: "850px" }}>
          <DataGrid rows={row} columns={columns} pageSize={10} autoHeight />
        </div>
      </div>
    </div>
  );
};

const AllRefundOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [user, dispatch]);

  const eligibleOrders= orders && orders.filter((item)=> item.status === "Processing refund")

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
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
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div>
      <h1 className="text-[25px] font-[600] text-black pb-2">
        Refund Requests
      </h1>
      <div className="w-full overflow-x-auto pt-2">
        <div style={{ minWidth: "850px" }}>
          <DataGrid rows={row} columns={columns} pageSize={10} autoHeight />
        </div>
      </div>
    </div>
  );
};

const TrackOrders = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [user, dispatch]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
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
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdOutlineTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div>
      <h1 className="text-[25px] font-[600] text-black pb-2">
        Track Your Orders
      </h1>
      <div className="w-full overflow-x-auto pt-2">
        <div style={{ minWidth: "850px" }}>
          <DataGrid rows={row} columns={columns} pageSize={10} autoHeight />
        </div>
      </div>
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${server}/user/update-password`,
        { oldPassword, newPassword, confirmPassword },
        {
          withCredentials: true,
        },
      );
      toast.success(res.data.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-[22px] 800px:text-[25px] text-center font-[600] text-black pb-2">
        Change Password
      </h1>
      <br />
      <div className="w-full md:px-5">
        <form onSubmit={passwordChangeHandler}>
          <div className="w-full flex flex-col justify-center items-center">
            <div className="w-[100%] 800px:w-[80%] pb-5">
              <label className="block pb-2">Old Password</label>
              <input
                type="password"
                className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563]`}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </div>
            <div className="w-[100%] 800px:w-[80%] pb-5">
              <label className="block pb-2">New Password</label>
              <input
                type="password"
                className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563]`}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="w-[100%] 800px:w-[80%] pb-5">
              <label className="block pb-2">Confirm Password</label>
              <input
                type="password"
                className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563]`}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-center mt-3 mb-7">
              <button
                className="text-sm 800px:text-lg w-full sm:w-[80%] h-12 flex items-center justify-center bg-black hover:bg-gray-800 text-white rounded-lg uppercase font-semibold shadow-lg transition disabled:opacity-80"
                type="submit"
              >
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        addressType === "" ||
        city === "" ||
        country === "" ||
        address1 === "" ||
        zipCode === ""
      ) {
        toast.error("Please fill the all fields!");
      } else {
        await dispatch(
          updateUserAddress(
            country,
            city,
            address1,
            address2,
            zipCode,
            addressType,
          ),
        );
        toast.success("Address saved successfully!");
        setOpen(false);
        setCountry("");
        setCity("");
        setAddress1("");
        setAddress2("");
        setZipCode("");
        setAddressType("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const handleDeleteAddress = async (item) => {
    try {
      await dispatch(deleteUserAddress(item._id));
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="w-full">
      {open && (
        <div className="fixed inset-0 z-[9999] h-screen bg-[#0000004b] flex items-center justify-center">
          <div className="w-[90%] 800px:w-[40%] h-[90vh] bg-white rounded-md shadow-md relative overflow-y-auto hide-scrollbar">
            <div className="w-full flex justify-end pt-4 pr-4">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[20px] 800px:text-[25px] font-Poppins">
              Add New Address
            </h1>
            <div className="w-full">
              <form onSubmit={handleSubmit}>
                <div className="w-full p-3">
                  <div className="w-full pl-5 pb-3">
                    <label className="block pb-2">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-[95%] border p-3 rounded-[5px]"
                    >
                      <option value="" className="block pb-2">
                        Choose your country
                      </option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pl-5 pb-3">
                    <label className="block pb-2">City</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-[95%] border p-3 rounded-[5px]"
                    >
                      <option value="" className="block pb-2">
                        Choose your city
                      </option>
                      {country &&
                        State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option
                            className="block pb-2"
                            key={item.isoCode}
                            value={item.isoCode}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="w-full pl-5 pb-3">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="address"
                      name="address1"
                      value={address1}
                      placeholder="Enter your address 1"
                      className={`w-[95%] border p-3 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563]`}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className="w-full pl-5 pb-3">
                    <label className="block pb-2">Address 2(optional)</label>
                    <input
                      type="address"
                      name="address2"
                      value={address2}
                      placeholder="Enter your address 2"
                      className={`w-[95%] border p-3 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563]`}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>
                  <div className="w-full pl-5 pb-3">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="number"
                      name="zipCode"
                      value={zipCode}
                      placeholder="Enter your zip code"
                      className={`w-[95%] border p-3 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#a30563] focus:border-[#a30563]`}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>
                  <div className="w-full pl-5 pb-5">
                    <label className="block pb-2">Address Type</label>
                    <select
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border p-3 rounded-[5px]"
                    >
                      <option value="" className="block pb-2">
                        Choose your address type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option
                            className="block pb-2"
                            key={item.name}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="w-full pl-5 pb-3">
                    <button
                      className="w-[95%] h-12 flex items-center justify-center bg-black hover:bg-gray-800 transition text-white rounded-lg uppercase font-semibold shadow-lg disabled:opacity-80"
                      type="submit"
                    >
                      Save Address
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center 800px:flex-row 800px:items-center 800px:justify-between gap-5 mb-6">
        <h1 className="text-[25px] 800px:text-[28px] font-[600] text-black text-center 800px:text-left">
          My Addresses
        </h1>

        <div className="w-full 800px:w-auto" onClick={() => setOpen(true)}>
          <button className="w-full 800px:w-[180px] h-[50px] bg-black hover:bg-gray-800 transition text-white rounded-lg font-[600] shadow-lg">
            Add New
          </button>
        </div>
      </div>

      <br />
      {user &&
        user.addresses.map((item) => (
          <div
            key={item._id}
            className="w-full mx-auto bg-white rounded-[10px] shadow-md p-5 mb-5 flex flex-col 800px:flex-row 800px:items-center 800px:justify-between"
          >
            {/* Address Type */}
            <div className="800px:w-[120px] mb-3 800px:mb-0">
              <h5 className="font-[600] text-[18px]">{item.addressType}</h5>
            </div>

            {/* Address */}
            <div className="800px:flex-1 mb-3 800px:mb-0">
              <h6 className="break-words 800px:whitespace-nowrap">
                {item.address1 || item.address2}
              </h6>
            </div>

            {/* Phone */}
            <div className="800px:w-[150px] mb-3 800px:mb-0">
              <h6>{user.phoneNumber}</h6>
            </div>

            {/* Delete Icon */}
            <div className="flex justify-center 800px:justify-end 800px:w-[50px]">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer hover:text-red-500"
                onClick={() => handleDeleteAddress(item)}
              />
            </div>
          </div>
        ))}
      {user && user.addresses.length === 0 && (
        <h5 className="text-center pb-10 text-[18px]">
          You not have any saved address!
        </h5>
      )}
    </div>
  );
};

export default ProfileContent;
