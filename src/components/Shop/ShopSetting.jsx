import { AiOutlineCamera } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";

const ShopSetting = () => {
  const { seller } = useSelector((state) => state.seller);

  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(
    seller && seller.description ? seller.description : "",
  );
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipcode] = useState(seller && seller.zipCode);

  const dispatch = useDispatch();

  const handleImage = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const formData = new FormData();

    formData.append("image", file);

    try {
      const res = await axios.put(
        `${server}/shop/update-shop-avatar`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      console.log(res.data);
      dispatch(loadSeller());
      toast.success("Avatar Updated Successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${server}/shop/update-shop-info`,
        {
          name,
          description,
          address,
          phoneNumber,
          zipCode,
        },
        { withCredentials: true },
      );

      toast.success(res.data.message);
      dispatch(loadSeller());

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-72px)] p-3 sm:p-5 lg:p-8">
      <div className="w-full max-w-[900px] mx-auto">
        {/* Main Card */}
        <div className="w-full rounded-2xl overflow-hidden">
          {/* Content */}
          <div className="px-4 sm:px-6 lg:px-10 py-4">
            {/* Shop Avatar */}
            <div className="flex flex-col items-center mb-5">
              <div className="relative">
                <img
                  src={`${backend_url}${seller?.avatar}`}
                  alt="profileImage"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#077f9c] hover:border-[#066f88] shadow-[0_4px_15px_rgba(15,23,42,0.12)]"
                />

                {/* Camera Button */}
                <div className="absolute bottom-0 right-0 w-[36px] h-[36px] rounded-full bg-[#077f9c] flex items-center justify-center shadow-md cursor-pointer hover:bg-[#066f88] transition">
                  <input
                    type="file"
                    name="image"
                    id="image"
                    className="hidden"
                    onChange={handleImage}
                  />

                  <label
                    htmlFor="image"
                    className="cursor-pointer w-full h-full flex items-center justify-center"
                  >
                    <AiOutlineCamera size={20} color="white" />
                  </label>
                </div>
              </div>

              <p className="text-[12px] text-[#94a3b8] mt-2">
                Click the camera icon to change your shop image
              </p>
            </div>

            {/* Form */}
            <form onSubmit={updateHandler} className="space-y-4">
              {/* Shop Name */}
              <div>
                <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                  Shop Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] bg-transparent outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                  Shop Description
                </label>

                <textarea
                  placeholder={
                    seller?.description
                      ? seller.description
                      : "Enter your shop description"
                  }
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] bg-transparent outline-none resize-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                  Shop Address
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] bg-transparent outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                  required
                />
              </div>

              {/* Phone + Zip */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                    Shop Phone Number
                  </label>

                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] bg-transparent outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                    required
                  />
                </div>

                {/* Zip */}
                <div>
                  <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                    Shop Zip Code
                  </label>

                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipcode(e.target.value)}
                    className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] bg-transparent outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                    required
                  />
                </div>
              </div>

              {/* Update Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full h-[48px] rounded-lg bg-[#077f9c] hover:bg-[#066f88] text-white text-[15px] font-[600] transition duration-200 shadow-sm hover:shadow-md"
                >
                  Update Shop
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSetting;
