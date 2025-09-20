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
  });

  const navigate = useNavigate(); // ✅ for redirect

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Convert comma-separated images into array
      const payload = {
        ...formData,
        donationGoal: Number(formData.donationGoal),
        images: formData.images.split(",").map((img) => img.trim()),
      };

      const res = await axios.post("http://localhost:8080/api/projects", payload);
      toast.success("✅ Project created successfully!");
      console.log(res.data);

      // Reset form
      setFormData({
        name: "",
        details: "",
        donationGoal: "",
        images: "",
      });

      // ✅ Redirect to Creator Dashboard
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
            <div>
              <label className="label">
                <span className="label-text">Project Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter project name"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Project Details */}
            <div>
              <label className="label">
                <span className="label-text">Project Details</span>
              </label>
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="Enter project details"
                className="textarea textarea-bordered w-full"
                required
              />
            </div>

            {/* Donation Goal */}
            <div>
              <label className="label">
                <span className="label-text">Donation Goal</span>
              </label>
              <input
                type="number"
                name="donationGoal"
                value={formData.donationGoal}
                onChange={handleChange}
                placeholder="Enter donation goal"
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Image URLs */}
            <div>
              <label className="label">
                <span className="label-text">Image URLs (comma separated)</span>
              </label>
              <input
                type="text"
                name="images"
                value={formData.images}
                onChange={handleChange}
                placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                className="input input-bordered w-full"
              />
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
