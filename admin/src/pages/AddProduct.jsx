import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddProduct = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [imagePreview, setImagePreview] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [formData, setFormData] = useState({
    barcode: "",
    name: "",
    ecoScore: "",
    materials: "",
    recyclable: false,
    carbonFootprint: "",
    recyclingTips: "",
    category: "",
    price: "",
    currentStock: "",
    salesHistory: "",
    seasonalTrend: "",
    weather: "",
    demandSpike: "",
    unitCost: "",
    supplierId: "",
    leadTime: "",
    availability: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coverImage) return toast.error("Please upload a cover image");

    try {
      const imgForm = new FormData();
      imgForm.append("coverImage", coverImage);

      const imgUpload = await axios.post(
        `${backendUrl}/api/products/upload-image`,
        imgForm,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const payload = {
        ...formData,
        materials: formData.materials.split(",").map((m) => m.trim()),
        salesHistory: formData.salesHistory
          .split(",")
          .map((n) => Number(n.trim())),
        externalFactors: {
          weather: formData.weather,
          demandSpike: formData.demandSpike,
        },
        suppliers: [
          {
            id: formData.supplierId,
            leadTime: Number(formData.leadTime),
            availability: formData.availability,
          },
        ],
        price: Number(formData.price),
        carbonFootprint: Number(formData.carbonFootprint),
        currentStock: Number(formData.currentStock),
        unitCost: Number(formData.unitCost),
        coverImage: imgUpload.data.url,
      };

      const res = await axios.post(`${backendUrl}/api/products/add`, payload);

      if (res.data.success) {
        toast.success("✅ Product added!");
        setFormData({});
        setCoverImage(null);
        setImagePreview(null);
      } else {
        toast.error(res.data.message || "Failed to add product");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Add New Product</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="barcode" onChange={handleChange} placeholder="Barcode" required className="input" />
        <input name="name" onChange={handleChange} placeholder="Product Name" required className="input" />
        <input name="ecoScore" onChange={handleChange} placeholder="Eco Score (e.g. A+)" className="input" />
        <input name="materials" onChange={handleChange} placeholder="Materials (comma-separated)" className="input" />
        <label className="flex items-center gap-2 col-span-2">
          <input type="checkbox" name="recyclable" onChange={handleChange} />
          Recyclable
        </label>
        <input name="carbonFootprint" onChange={handleChange} placeholder="Carbon Footprint" className="input" />
        <input name="recyclingTips" onChange={handleChange} placeholder="Recycling Tips" className="input" />
        <input name="category" onChange={handleChange} placeholder="Category" className="input" />
        <input name="price" onChange={handleChange} placeholder="Price" className="input" />
        <input name="currentStock" onChange={handleChange} placeholder="Current Stock" className="input" />
        <input name="salesHistory" onChange={handleChange} placeholder="Sales History (comma-separated)" className="input" />
        <input name="seasonalTrend" onChange={handleChange} placeholder="Seasonal Trend" className="input" />
        <input name="weather" onChange={handleChange} placeholder="Weather Impact" className="input" />
        <input name="demandSpike" onChange={handleChange} placeholder="Demand Spike Info" className="input" />
        <input name="unitCost" onChange={handleChange} placeholder="Unit Cost" className="input" />
        <input name="supplierId" onChange={handleChange} placeholder="Supplier ID" className="input" />
        <input name="leadTime" onChange={handleChange} placeholder="Lead Time (days)" className="input" />
        <label className="flex items-center gap-2 col-span-2">
          <input type="checkbox" name="availability" onChange={handleChange} />
          Supplier Available
        </label>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full text-sm text-gray-500" />
          {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 w-40 h-40 object-cover rounded shadow" />}
        </div>

        <button type="submit" className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
