import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreatorDashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // Fetch all projects (no filtering)
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data.projects); // ✅ using backend response format
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/creator-home")}
          >
            ➕ Create Post
          </button>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <p className="text-center text-gray-500">No projects created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project._id} className="card bg-base-100 shadow-xl">
                {project.images.length > 0 && (
                  <figure>
                    <img
                      src={project.images[0]}
                      alt={project.name}
                      className="h-48 w-full object-cover"
                    />
                  </figure>
                )}
                <div className="card-body">
                  <h2 className="card-title">{project.name}</h2>
                  <p className="line-clamp-3">{project.details}</p>
                  <div className="mt-2">
                    <progress
                      className="progress progress-primary w-full"
                      value={project.donationProgress}
                      max={project.donationGoal}
                    ></progress>
                    <p className="text-sm mt-1">
                      ₹{project.donationProgress} / ₹{project.donationGoal}
                    </p>
                  </div>
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
