import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ProjectDashboard = () => {
  const { id } = useParams(); // get project id from URL
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/projects/${id}`);
        setProject(res.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    fetchProject();
  }, [id]);

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading project...</p>
      </div>
    );
  }

  // ✅ Calculate progress
  const progress = Math.min(
    (project.donationProgress / project.donationGoal) * 100,
    100
  ).toFixed(1);

  // ✅ Example impact metric: 20% of goal = 4 trees, so full goal = 20 trees
  const treesEquivalent = Math.round((progress / 100) * 20);

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-3xl mx-auto bg-base-100 shadow-xl rounded-xl p-8">
        {/* Back Button */}
        <button className="btn btn-ghost mb-4" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Project Title */}
        <h1 className="text-4xl font-bold text-primary mb-4">{project.name}</h1>

        {/* ✅ Image Carousel */}
        {project.images && project.images.length > 0 && (
          <div className="carousel w-full mb-6 rounded-xl overflow-hidden shadow-md">
            {project.images.map((img, idx) => (
              <div
                key={idx}
                id={`slide${idx}`}
                className="carousel-item relative w-full"
              >
                <img
                  src={img}
                  alt={`Project ${idx + 1}`}
                  className="w-full h-80 object-cover"
                />
                {/* Navigation Arrows */}
                <div className="absolute flex justify-between transform -translate-y-1/2 left-2 right-2 top-1/2">
                  <a
                    href={`#slide${(idx - 1 + project.images.length) % project.images.length}`}
                    className="btn btn-circle btn-sm"
                  >
                    ❮
                  </a>
                  <a
                    href={`#slide${(idx + 1) % project.images.length}`}
                    className="btn btn-circle btn-sm"
                  >
                    ❯
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project Details */}
        <p className="text-gray-700 mb-6">{project.details}</p>

        {/* Progress Bar */}
        <div className="mb-6">
          <progress
            className="progress progress-primary w-full"
            value={project.donationProgress}
            max={project.donationGoal}
          ></progress>
          <p className="mt-2 text-sm text-gray-600">
            Raised ₹{project.donationProgress} of ₹{project.donationGoal} ({progress}%)
          </p>
        </div>

        {/* Impact Statement */}
        <div className="p-4 bg-secondary text-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold">🌱 Your Impact</h2>
          <p className="mt-2">
            {progress}% of our goal means we can buy <b>{treesEquivalent} trees</b>!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
