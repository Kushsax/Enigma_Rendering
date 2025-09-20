import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import WalletSection from "../components/Wallet";

const UserHome = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [donations, setDonations] = useState([]);
  const [donorStats, setDonorStats] = useState({});
  const [customAmount, setCustomAmount] = useState(null);
  const navigate = useNavigate();

  // Hardcoded donors for simulation
  const donors = ["🌟 Alice", "🔥 Bob", "💖 Charlie", "✨ Diana", "⚡ Eve", "🌍 Frank"];
  const amounts = [5, 10, 50, 100];

  // Badge assignment
  const getBadge = (count) => {
    if (count >= 10) return "🔥 Gold Donor";
    if (count >= 5) return "🌟 Silver Donor";
    if (count >= 1) return "🌱 Bronze Donor";
    return "🤍 New Donor";
  };

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

  // Simulate live donations every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      if (projects.length === 0) return;

      const donor = donors[Math.floor(Math.random() * donors.length)];
      const project = projects[Math.floor(Math.random() * projects.length)];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      // update donor stats
      setDonorStats((prev) => {
        const newCount = (prev[donor]?.count || 0) + 1;
        return {
          ...prev,
          [donor]: { count: newCount, badge: getBadge(newCount) },
        };
      });

      const newDonation = { donor, project: project.name, amount, time };
      setDonations((prev) => [newDonation, ...prev].slice(0, 8));
    }, 3000);

    return () => clearInterval(interval);
  }, [projects]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Handle Donation (Quick Donate)
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

      // update current donor badge
      const donorName = "🙋 You"; // Replace with logged-in user if available
      setDonorStats((prev) => {
        const newCount = (prev[donorName]?.count || 0) + 1;
        return {
          ...prev,
          [donorName]: { count: newCount, badge: getBadge(newCount) },
        };
      });

      toast.success(
        `🎉 You donated ₹${amount}! Level up: ${getBadge(
          (donorStats["🙋 You"]?.count || 0) + 1
        )}`
      );
      setSelectedProject(null);
    } catch (err) {
      console.error("Donation failed:", err);
      toast.error("❌ Failed to donate");
    }
  };

  // Handle Razorpay Checkout
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
      {/* Navbar */}
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

      {/* Image Carousel Section */}
    <section className="w-full">
      <div className="carousel w-full h-[700px]">
        {/* Slide 1 */}
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7" 
            alt="Food Donation"
            className="w-full object-cover"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" className="btn btn-circle">❮</a>
            <a href="#slide2" className="btn btn-circle">❯</a>
          </div>
          <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-3xl font-bold">🍲 Food Donations</h2>
            <p className="text-lg">Helping 500+ families fight hunger</p>
          </div>
        </div>

        {/* Slide 2 */}
        <div id="slide2" className="carousel-item relative w-full">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
            alt="Medical Aid"
            className="w-full object-cover"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle">❮</a>
            <a href="#slide3" className="btn btn-circle">❯</a>
          </div>
          <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-3xl font-bold">💊 Medical Support</h2>
            <p className="text-lg">Providing free medicines & care</p>
          </div>
        </div>

        {/* Slide 3 */}
        <div id="slide3" className="carousel-item relative w-full">
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
            alt="Education"
            className="w-full object-cover"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle">❮</a>
            <a href="#slide1" className="btn btn-circle">❯</a>
          </div>
          <div className="absolute bottom-10 left-10 text-white">
            <h2 className="text-3xl font-bold">📚 Education for All</h2>
            <p className="text-lg">Donations funding school supplies</p>
          </div>
        </div>
      </div>
    </section>

      {/* 🚨 Emergency Needs Section */}
      <section className="bg-base-200 py-10 px-6">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600 animate-pulse">
          🚨 Urgent Help Needed!
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {projects
            .filter((p) => p.acceptsInKind || p.donationGoal - p.donationProgress < 5000)
            .slice(0, 3)
            .map((project) => (
              <div
                key={project._id}
                className="p-5 bg-base-100 rounded-xl border border-red-400 shadow-md hover:shadow-lg transition"
              >
                {/* 🔴 Emergency Highlight */}
                <h3 className="text-xl font-bold text-red-600 mb-2">
                  {project.name}
                </h3>

                {/* Short Need Statement */}
                <p className="text-sm text-gray-300 mb-2 italic">
                  {project.details.length > 80
                    ? project.details.substring(0, 80) + "..."
                    : project.details}
                </p>

                {/* Usage of Donation */}
                <p className="text-sm text-red-500 font-semibold">
                  ⚡ Donations will be used for:
                </p>
                <ul className="list-disc ml-5 text-gray-200 text-sm">
                  {project.items.length > 0
                    ? project.items.slice(0, 2).map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))
                    : "Urgent monetary support required"}
                </ul>

                {/* Compact Progress */}
                <div className="mt-3">
                  <progress
                    className="progress progress-error w-full"
                    value={project.donationProgress}
                    max={project.donationGoal}
                  ></progress>
                  <p className="text-xs mt-1 text-gray-400">
                    ₹{project.donationProgress} / ₹{project.donationGoal}
                  </p>
                </div>

                {/* Button */}
                <button
                  className="btn btn-error btn-sm w-full mt-4"
                  onClick={() => setSelectedProject(project)}
                >
                  🚑 Support Now
                </button>
              </div>
            ))}
        </div>
      </section>

      <WalletSection/>

      {/* Projects + Live Donations */}
      <main className="flex-grow bg-base-200 py-12 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">🔥 Featured Projects</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            {projects.length === 0 ? (
              <p className="text-center text-gray-500">No projects available yet.</p>
            ) : (
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-2">
                {projects.map((project) => (
                  <div key={project._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                    {project.images?.length > 0 && (
                      <figure>
                        <img src={project.images[0]} alt={project.name} className="h-48 w-full object-cover" />
                      </figure>
                    )}
                    <div className="card-body">
                      <h3 className="card-title text-primary">{project.name}</h3>
                      <p className="text-gray-700">{project.details}</p>
                      <progress
                        className="progress progress-primary w-full"
                        value={project.donationProgress}
                        max={project.donationGoal}
                      ></progress>
                      <p className="text-sm mt-2">₹{project.donationProgress} / ₹{project.donationGoal}</p>
                      <div className="card-actions justify-between mt-4">
                        <button className="btn btn-primary btn-sm" onClick={() => setSelectedProject(project)}>💖 Support</button>
                        <button className="btn btn-outline btn-secondary btn-sm" onClick={() => navigate(`/project/${project._id}`)}>📊 View Dashboard</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

              
          

          {/* Live Donations Feed */}
          <div className="bg-base-100 p-6 rounded-xl shadow-inner h-fit">
            <h2 className="text-2xl font-bold mb-4 text-center">💸 Live Donations</h2>
            <div className="overflow-y-auto max-h-96">
              <ul className="space-y-3">
                {donations.length === 0 ? (
                  <p className="text-center text-gray-500">Waiting for donations...</p>
                ) : (
                  donations.map((d, idx) => {
                    const badge = donorStats[d.donor]?.badge || "🤍 New Donor";
                    return (
                      <li key={idx} className="flex justify-between items-center border-b pb-2 text-sm">
                        <span>
                          {d.donor} <span className="badge badge-secondary ml-1">{badge}</span>
                        </span>
                        <span className="text-green-600 font-semibold">₹{d.amount}</span>
                        <span className="text-gray-500">{d.time}</span>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
      

      {/* Donation Modal */}
      {selectedProject && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-primary">Donate to {selectedProject.name}</h3>
            <p className="py-4">Choose a donation amount:</p>

            {/* Quick buttons */}
            <div className="flex gap-3 flex-wrap mb-4">
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

            {/* Custom input */}
            <input
              type="number"
              placeholder="Enter custom amount"
              className="input input-bordered w-full mb-4"
              onChange={(e) => setCustomAmount(Number(e.target.value))}
            />

            {/* Razorpay Option */}
            <button
              className="btn btn-primary w-full"
              onClick={() => handleRazorpayPayment(customAmount || 100)}
            >
              💳 Pay with Razorpay
            </button>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setSelectedProject(null)}>❌ Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
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
