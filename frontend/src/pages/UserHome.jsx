import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const UserHome = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [donations, setDonations] = useState([]); // ✅ live donations
  const navigate = useNavigate();

  // Hardcoded donors + projects for simulation
  const donors = ["🌟 Alice", "🔥 Bob", "💖 Charlie", "✨ Diana", "⚡ Eve", "🌍 Frank"];
  const amounts = [5, 10, 50, 100];

  // Fetch projects from backend
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/projects");
      setProjects(res.data.projects);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ✅ Simulate live donations every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      if (projects.length === 0) return;

      const donor = donors[Math.floor(Math.random() * donors.length)];
      const project = projects[Math.floor(Math.random() * projects.length)];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const newDonation = { donor, project: project.name, amount, time };

      setDonations((prev) => [newDonation, ...prev].slice(0, 8));
    }, 3000);

    return () => clearInterval(interval);
  }, [projects]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ✅ Handle Donation (Quick Donate)
  const handleDonate = async (amount) => {
    if (!selectedProject) return;

    try {
      const newProgress =
        selectedProject.donationProgress + amount > selectedProject.donationGoal
          ? selectedProject.donationGoal
          : selectedProject.donationProgress + amount;

      const res = await axios.patch(
        `http://localhost:8080/api/projects/${selectedProject._id}/donation`,
        { donationProgress: newProgress }
      );

      const updatedProjects = projects.map((p) =>
        p._id === selectedProject._id ? res.data.project : p
      );
      setProjects(updatedProjects);

      toast.success(`🎉 You donated ₹${amount}!`);
      setSelectedProject(null);
    } catch (err) {
      console.error("Donation failed:", err);
      toast.error("❌ Failed to donate");
    }
  };

  // ✅ Handle Razorpay Checkout
  const handleRazorpayPayment = async (amount) => {
    if (!selectedProject) return;

    try {
      const res = await axios.post("http://localhost:8080/api/payments/create-order", { amount });
      const { order } = res.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID",
        amount: order.amount,
        currency: order.currency,
        name: "DonateUs",
        description: `Donation to ${selectedProject.name}`,
        order_id: order.id,
        handler: async function (response) {
          await axios.post("http://localhost:8080/api/payments/verify", response);
          toast.success(`✅ Donation of ₹${amount} successful!`);
          await handleDonate(amount);
        },
        prefill: {
          name: "Donor",
          email: "donor@example.com",
          contact: "9999999999",
        },
        theme: { color: "#0ea5e9" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Razorpay error:", err);
      toast.error("❌ Payment failed");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ✅ Navbar */}
      <nav className="navbar bg-base-100 shadow-md px-6">
        <div className="flex-1">
          <span className="text-2xl font-extrabold text-primary tracking-wide">
            💙 DonateUs
          </span>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-ghost">Home</button>
          <button className="btn btn-ghost">About</button>
          <button className="btn btn-ghost">Contact</button>
          <button className="btn btn-outline btn-error" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </nav>

      {/* ✅ Hero Section */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-extrabold drop-shadow-md">Welcome to DonateUs ✨</h1>
        <p className="mt-4 text-lg">Empower change by supporting meaningful projects around you.</p>
      </header>

      {/* ✅ Projects + Live Donations Side-by-Side */}
      <main className="flex-grow bg-base-200 py-12 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">🔥 Featured Projects</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section (2/3) */}
          <div className="lg:col-span-2">
            {projects.length === 0 ? (
              <p className="text-center text-gray-500">No projects available yet.</p>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
                  >
                    {project.images?.length > 0 && (
                      <figure>
                        <img
                          src={project.images[0]}
                          alt={project.name}
                          className="h-48 w-full object-cover"
                        />
                      </figure>
                    )}
                    <div className="card-body">
                      <h3 className="card-title text-primary">{project.name}</h3>
                      <p className="text-gray-700">{project.details}</p>

                      {/* ✅ In-Kind Donations */}
                      {project.acceptsInKind && project.items?.length > 0 && (
                        <div className="mt-3">
                          <h4 className="font-semibold text-sm text-secondary">
                            🧺 Accepts In-Kind Donations:
                          </h4>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {project.items.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div>
                        <progress
                          className="progress progress-primary w-full"
                          value={project.donationProgress}
                          max={project.donationGoal}
                        ></progress>
                        <p className="text-sm mt-2">
                          ₹{project.donationProgress} / ₹{project.donationGoal}
                        </p>
                      </div>

                      <div className="card-actions justify-between mt-4">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedProject(project)}
                        >
                          💖 Support
                        </button>
                        <button
                          className="btn btn-outline btn-secondary btn-sm"
                          onClick={() => navigate(`/project/${project._id}`)}
                        >
                          📊 View Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Donations Feed (1/3) */}
          <div className="bg-base-100 p-6 rounded-xl shadow-inner h-fit">
            <h2 className="text-2xl font-bold mb-4 text-center">💸 Live Donations</h2>
            <div className="overflow-y-auto max-h-96">
              <ul className="space-y-3">
                {donations.length === 0 ? (
                  <p className="text-center text-gray-500">Waiting for donations...</p>
                ) : (
                  donations.map((d, idx) => (
                    <li
                      key={idx}
                      className="flex justify-between items-center border-b pb-2 text-sm"
                    >
                      <span>{d.donor}</span>
                      <span className="text-green-600 font-semibold">₹{d.amount}</span>
                      <span className="text-gray-500">{d.time}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* ✅ Donation Modal */}
{selectedProject && (
  <div className="modal modal-open">
    <div className="modal-box">
      <h3 className="font-bold text-lg text-primary">
        Donate to {selectedProject.name}
      </h3>

      {/* Tabs: Money | In-Kind */}
      <div role="tablist" className="tabs tabs-bordered mt-4">
        {/* Money Donations */}
        <input
          type="radio"
          name="donation-tabs"
          role="tab"
          className="tab"
          aria-label="Money"
          defaultChecked
        />
        <div role="tabpanel" className="tab-content py-4">
          <p className="mb-3">Choose a donation amount:</p>
          <div className="flex gap-3 flex-wrap">
            {[5, 10, 50, 100].map((amount) => (
              <button
                key={amount}
                className="btn btn-outline btn-primary"
                onClick={() => handleDonate(amount)}
              >
                ₹{amount}
              </button>
            ))}
          </div>

          {/* Razorpay Option */}
          <div className="mt-6">
            <button
              className="btn btn-primary w-full"
              onClick={() => handleRazorpayPayment(100)}
            >
              💳 Pay with Razorpay
            </button>
          </div>
        </div>

        {/* In-Kind Donations */}
        {selectedProject.acceptsInKind && (
          <>
            <input
              type="radio"
              name="donation-tabs"
              role="tab"
              className="tab"
              aria-label="In-Kind"
            />
            <div role="tabpanel" className="tab-content py-4">
              <p className="mb-3">This project accepts in-kind donations:</p>
              <ul className="list-disc list-inside text-sm text-gray-700 mb-4">
                {selectedProject.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
              <div className="flex flex-col gap-2">
                {selectedProject.items.map((item, idx) => (
                  <button
                    key={idx}
                    className="btn btn-outline btn-secondary"
                    onClick={() => {
                      toast.success(`🎁 You pledged to donate: ${item}`);
                      setSelectedProject(null);
                    }}
                  >
                    Donate {item}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Cancel Button */}
      <div className="modal-action">
        <button
          className="btn btn-ghost"
          onClick={() => setSelectedProject(null)}
        >
          ❌ Cancel
        </button>
      </div>
    </div>
  </div>
)}


      {/* ✅ Footer */}
      <footer className="footer footer-center bg-base-300 text-base-content p-6">
        <aside>
          <p className="font-semibold">© {new Date().getFullYear()} DonateUs</p>
          <p>Built with ❤️ using MERN + Tailwind + DaisyUI</p>
        </aside>
      </footer>
    </div>
  );
};

export default UserHome;
