import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    donationGoal: "",
    images: "",
    acceptsInKind: false,
    items: [], // ✅ will store selected items
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleItemToggle = (item) => {
    setFormData((prev) => {
      if (prev.items.includes(item)) {
        return { ...prev, items: prev.items.filter((i) => i !== item) };
      } else {
        return { ...prev, items: [...prev.items, item] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        donationGoal: Number(formData.donationGoal),
        images: formData.images.split(",").map((img) => img.trim()),
      };

      const res = await axios.post("http://localhost:8080/api/projects", payload);
      toast.success("✅ Project created successfully!");

      const savedProjects = JSON.parse(localStorage.getItem("myProjects")) || [];
      savedProjects.unshift(res.data.project);
      localStorage.setItem("myProjects", JSON.stringify(savedProjects));

      setFormData({
        name: "",
        details: "",
        donationGoal: "",
        images: "",
        acceptsInKind: false,
        items: [],
      });

      navigate("/creator-dashboard");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to create project");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Create a Project</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Name */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              className="input input-bordered w-full"
              required
            />

            {/* Project Details */}
            <textarea
              name="details"
              value={formData.details}
              onChange={handleChange}
              placeholder="Enter project details"
              className="textarea textarea-bordered w-full"
              required
            />

            {/* Donation Goal */}
            <input
              type="number"
              name="donationGoal"
              value={formData.donationGoal}
              onChange={handleChange}
              placeholder="Enter donation goal"
              className="input input-bordered w-full"
              required
            />

            {/* Image URLs */}
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
              placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
              className="input input-bordered w-full"
            />

            {/* ✅ In-Kind Donations */}
            <div>
              <label className="cursor-pointer flex items-center gap-2">
                <input
                  type="checkbox"
                  name="acceptsInKind"
                  checked={formData.acceptsInKind}
                  onChange={handleChange}
                  className="checkbox checkbox-primary"
                />
                <span>Accept In-Kind Donations</span>
              </label>

              {formData.acceptsInKind && (
                <div className="mt-3 space-y-2">
                  {["Clothes", "Books", "Food", "Toys"].map((item) => (
                    <label
                      key={item}
                      className="cursor-pointer flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.items.includes(item)}
                        onChange={() => handleItemToggle(item)}
                        className="checkbox checkbox-sm"
                      />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary w-full">
              🚀 Create Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
