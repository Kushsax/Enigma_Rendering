import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ModeratorDashboard = () => {
  const navigate = useNavigate();
  const [flaggedProjects, setFlaggedProjects] = useState([]);

  // 🔍 Fetch flagged or suspicious projects
  useEffect(() => {
    const fetchFlagged = async () => {
      try {
        // 👉 Replace with real API later
        const res = await axios.get("http://localhost:8080/api/projects"); 
        // Example: just simulate flagged ones
        const flagged = res.data.projects.filter(
          (p) => p.donationProgress > p.donationGoal * 0.8 // suspicious condition
        );
        setFlaggedProjects(flagged);
      } catch (err) {
        console.error("Error fetching flagged projects:", err);
      }
    };
    fetchFlagged();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-base-200 p-6">
      {/* Navbar */}
      <nav className="navbar bg-base-100 shadow-md mb-8">
        <div className="flex-1">
          <span className="text-2xl font-extrabold text-primary">🛡 Moderator</span>
        </div>
        <div>
          <button className="btn btn-outline btn-error" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* Dashboard */}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Moderator Dashboard</h1>
        <p className="mb-6 text-gray-600">
          Review flagged and suspicious projects. You can mark them as{" "}
          <span className="font-semibold text-warning">⚠️ suspicious</span> or{" "}
          <span className="font-semibold text-success">✅ safe</span>.
        </p>

        {flaggedProjects.length === 0 ? (
          <p className="text-center text-gray-500">
            🎉 No flagged projects at the moment.
          </p>
        ) : (
          <div className="space-y-6">
            {flaggedProjects.map((project) => (
              <div
                key={project._id}
                className="card bg-base-100 shadow-lg p-4 border border-base-300"
              >
                <h2 className="text-xl font-bold text-primary">{project.name}</h2>
                <p className="text-gray-700">{project.details}</p>
                <p className="text-sm mt-2">
                  Progress: ₹{project.donationProgress} / ₹{project.donationGoal}
                </p>
                <div className="flex gap-3 mt-4">
                  <button className="btn btn-sm btn-success">✅ Mark Safe</button>
                  <button className="btn btn-sm btn-warning">⚠️ Flag</button>
                  <button className="btn btn-sm btn-error">🗑 Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDashboard;
