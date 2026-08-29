import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categoriesData } from "../../../static/data";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { createEvent } from "../../../redux/actions/event";
import { toast } from "react-toastify";

const CreateEvents = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.events);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartDate = (e) => {
    const startDate = new Date(e.target.value);
    const minEndDate = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
    setStartDate(startDate);
    setEndDate(null);
    document.getElementById("end-date").min = minEndDate
      .toISOString()
      .slice(0, 10);
  };

  const handleEndDate = (e) => {
    const endDate = new Date(e.target.value);
    setEndDate(endDate);
  };

  const today = new Date().toISOString().slice(0, 10);

  const minEndDate = startDate
    ? new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : today;

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success("Event created successfully!");
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [error, success, navigate]);

  const handleImageChange = (e) => {
    e.preventDefault();

    let files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newForm = new FormData();

    images.forEach((image) => {
      newForm.append("images", image);
    });
    newForm.append("name", name);
    newForm.append("description", description);
    newForm.append("category", category);
    newForm.append("tags", tags);
    newForm.append("originalPrice", originalPrice);
    if (discountPrice !== "" && discountPrice !== undefined) {
      newForm.append("discountPrice", discountPrice);
    }
    newForm.append("stock", stock);
    newForm.append("shopId", seller._id);
    newForm.append("start_Date", startDate.toISOString());
    newForm.append("finish_Date", endDate.toISOString());
    dispatch(createEvent(newForm));
  };

  return (
    <div className="w-full h-[calc(100vh-80px)] p-3 sm:p-5 lg:p-8 overflow-hidden">
      <div className="w-full max-w-[900px] h-full mx-auto">
        <div className="w-full h-full bg-white rounded-2xl border border-[#edf0f4] shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col">
          {/* Header - fixed */}
          <div className="shrink-0 px-5 sm:px-8 pt-5 sm:pt-6 pb-4 border-b border-[#edf0f4]">
            <h5 className="text-[24px] sm:text-[28px] text-center font-Poppins font-[600] text-[#1f2937]">
              Create Event
            </h5>
          </div>

          {/* Scrollable Form Area */}
          <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar px-5 sm:px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name */}
              <div>
                <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                  Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  placeholder="Enter your event product name..."
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                  Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows="6"
                  name="description"
                  required
                  value={description}
                  placeholder="Enter your event product description..."
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] outline-none resize-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                  Category <span className="text-red-500">*</span>
                </label>

                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] bg-white outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                >
                  <option value="Choose a category">Choose a category</option>

                  {categoriesData &&
                    categoriesData.map((i) => (
                      <option value={i.title} key={i.title}>
                        {i.title}
                      </option>
                    ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                  Tags
                </label>

                <input
                  type="text"
                  name="tags"
                  required
                  value={tags}
                  placeholder="Enter your event product tags..."
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] placeholder-[#9ca3af] outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                    Original Price <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="number"
                    name="price"
                    required
                    value={originalPrice}
                    placeholder="Enter original price..."
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                    Price{" "}
                    <span className="text-[#94a3b8]">(with Discount)</span>
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={discountPrice}
                    placeholder="Enter discounted price..."
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                  />
                </div>
              </div>

              {/* Stock */}
              <div>
                <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                  Product Stock <span className="text-red-500">*</span>
                </label>

                <input
                  type="number"
                  name="stock"
                  required
                  value={stock}
                  placeholder="Enter event product stock..."
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                    Event Start Date <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    name="start-date"
                    id="start-date"
                    required
                    value={
                      startDate ? startDate.toISOString().slice(0, 10) : ""
                    }
                    onChange={handleStartDate}
                    min={today}
                    className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] bg-white outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                  />
                </div>

                <div>
                  <label className="block text-[14px] font-[500] text-[#374151] mb-2">
                    Event End Date <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="date"
                    name="end-date"
                    id="end-date"
                    required
                    value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                    onChange={handleEndDate}
                    min={minEndDate}
                    className="w-full h-[46px] px-4 border border-[#dfe3e8] rounded-lg text-[14px] text-[#374151] bg-white outline-none transition focus:border-[#077f9c] focus:ring-2 focus:ring-[#077f9c]/10"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-[14px] font-[500] text-[#374151] mb-3">
                  Upload Event Images <span className="text-red-500">*</span>
                </label>

                <input
                  type="file"
                  name="images"
                  id="upload"
                  required
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-3">
                  <label
                    htmlFor="upload"
                    className="w-[100px] h-[100px] border-2 border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#077f9c] hover:bg-[#f8fcfd] transition"
                  >
                    <AiOutlinePlusCircle size={30} className="text-[#64748b]" />

                    <span className="text-[11px] text-[#94a3b8] mt-1">
                      Add Image
                    </span>
                  </label>

                  {images &&
                    images.map((i) => (
                      <img
                        src={URL.createObjectURL(i)}
                        key={i}
                        alt=""
                        className="w-[100px] h-[100px] object-cover rounded-xl border border-[#e2e8f0]"
                      />
                    ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2 pb-2">
                <button
                  type="submit"
                  className="w-full h-[48px] rounded-lg bg-[#077f9c] hover:bg-[#066f88] text-white text-[15px] font-[600] transition duration-200 shadow-sm hover:shadow-md"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvents;
