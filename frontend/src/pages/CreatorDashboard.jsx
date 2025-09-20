import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const CreatorDashboard = () => {
  const [localProjects, setLocalProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("myProjects")) || [];
    setLocalProjects(localData);
  }, []);

  // ✅ Delete Project
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/projects/${id}`);
      const updated = localProjects.filter((p) => p._id !== id);
      setLocalProjects(updated);
      localStorage.setItem("myProjects", JSON.stringify(updated));
      toast.success("🗑 Project deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("❌ Failed to delete project");
    }
  };

  // ✅ Save Edit
  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8080/api/projects/${editingProject._id}`,
        editingProject
      );
      const updated = localProjects.map((p) =>
        p._id === editingProject._id ? res.data.project : p
      );
      setLocalProjects(updated);
      localStorage.setItem("myProjects", JSON.stringify(updated));
      toast.success("✏️ Project updated successfully!");
      setEditingProject(null); // close edit mode
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("❌ Failed to update project");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <div className="flex gap-3">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/creator-home")}
            >
              ➕ Create Post
            </button>
            <button
              className="btn btn-outline btn-error"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        {/* ✅ Your Projects Section */}
        <h2 className="text-2xl font-semibold mb-6">📌 Your Projects</h2>
        {localProjects.length === 0 ? (
          <p className="text-gray-500">You haven’t created any projects yet.</p>
        ) : (
          <div className="space-y-6">
            {localProjects.map((project) => (
              <div
                key={project._id || project.name}
                className="card bg-base-100 shadow-xl flex flex-col lg:flex-row h-auto"
              >
                {/* Image Section */}
                {project.images?.length > 0 && (
                  <figure className="lg:w-1/3 w-full h-64 lg:h-auto">
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="w-full h-full object-cover rounded-l-xl"
                    />
                  </figure>
                )}

                {/* Content Section */}
                <div className="card-body flex flex-col justify-between lg:w-2/3">
                  {editingProject?._id === project._id ? (
                    // ✅ Edit Form
                    <form onSubmit={handleEditSave} className="space-y-3">
                      <input
                        type="text"
                        className="input input-bordered w-full"
                        value={editingProject.name}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            name: e.target.value,
                          })
                        }
                      />
                      <textarea
                        className="textarea textarea-bordered w-full"
                        value={editingProject.details}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            details: e.target.value,
                          })
                        }
                      />
                      <input
                        type="number"
                        className="input input-bordered w-full"
                        value={editingProject.donationGoal}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            donationGoal: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2">
                        <button className="btn btn-success btn-sm" type="submit">
                          💾 Save
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          type="button"
                          onClick={() => setEditingProject(null)}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div>
                        <h2 className="card-title text-2xl">{project.name}</h2>
                        <p className="mt-2">{project.details}</p>
                      </div>

                      {/* Donation Progress */}
                      <div className="mt-4">
                        <progress
                          className="progress progress-primary w-full"
                          value={project.donationProgress}
                          max={project.donationGoal}
                        ></progress>
                        <p className="text-sm mt-2">
                          ₹{project.donationProgress} / ₹{project.donationGoal}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-4">
                        <button
                          className="btn btn-sm btn-outline btn-primary"
                          onClick={() => setEditingProject(project)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline btn-error"
                          onClick={() => handleDelete(project._id)}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorDashboard;
