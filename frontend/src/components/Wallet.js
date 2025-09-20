import { useState } from "react";
import { toast } from "react-hot-toast";
import { Wallet } from "lucide-react";

const WalletSection = () => {
  const [walletBalance, setWalletBalance] = useState(500); // starting balance
  const [consent, setConsent] = useState(false);
  const [sdpEnabled, setSdpEnabled] = useState(false); // toggle for SDP
  const [sdpPlan, setSdpPlan] = useState(null); // active SDP plan

  // Add funds locally
  const handleAddFunds = (amount) => {
    setWalletBalance(walletBalance + amount);
    toast.success(`✅ Added ₹${amount} to wallet!`);
  };

  // Toggle consent
  const handleConsent = () => {
    setConsent(!consent);
    toast.success(!consent ? "✅ Consent granted" : "❌ Consent revoked");
  };

  // Enable/Disable SDP
  const handleSdpToggle = () => {
    setSdpEnabled(!sdpEnabled);
    setSdpPlan(null); // reset plan if disabled
    toast.success(!sdpEnabled ? "📅 SDP Enabled" : "❌ SDP Disabled");
  };

  // Handle plan selection
  const handleSdpPlan = (frequency) => {
    if (!sdpEnabled) return;
    setSdpPlan(frequency);
    toast.success(`📅 SDP activated: Auto-add funds ${frequency}!`);
  };

  return (
    <section className="mt-10">
      <div className="card bg-base-100 shadow-xl border border-base-300 p-6 rounded-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 text-primary">
            <Wallet className="w-6 h-6" /> Emergency Wallet
          </h2>
          <span className="badge badge-lg bg-primary text-white font-bold shadow">
            💰 ₹{walletBalance}
          </span>
        </div>

        {/* Consent Toggle */}
        <div className="flex items-center justify-between bg-base-200 p-4 rounded-lg mb-6">
          <p className="font-medium text-error">
            Allow auto-use of funds during emergencies 🚨
          </p>
          <input
            type="checkbox"
            className="toggle toggle-error"
            checked={consent}
            onChange={handleConsent}
          />
        </div>

        {/* Add Funds */}
        <div className="mb-6">
          <p className="mb-3 text-lg font-semibold text-primary">
            Add Funds to Wallet:
          </p>
          <div className="flex gap-4 flex-wrap">
            {[100, 500, 1000].map((amt) => (
              <button
                key={amt}
                className="btn btn-outline btn-primary"
                onClick={() => handleAddFunds(amt)}
              >
                + ₹{amt}
              </button>
            ))}
          </div>
        </div>

        {/* Systematic Donations Plan (SDP) */}
        <div className="bg-base-200 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <p className="text-lg font-semibold text-primary">
              📅 Systematic Donations Plan (SDP)
            </p>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={sdpEnabled}
              onChange={handleSdpToggle}
            />
          </div>

          <p className="text-sm text-gray-600 mb-3">
            Automatically load money into your wallet every week or month.
          </p>

          {/* Plan Selection */}
          <div className="flex gap-3">
            <button
              className={`btn ${
                sdpPlan === "weekly" ? "btn-primary" : "btn-outline btn-primary"
              }`}
              disabled={!sdpEnabled}
              onClick={() => handleSdpPlan("weekly")}
            >
              Weekly
            </button>
            <button
              className={`btn ${
                sdpPlan === "monthly" ? "btn-primary" : "btn-outline btn-primary"
              }`}
              disabled={!sdpEnabled}
              onClick={() => handleSdpPlan("monthly")}
            >
              Monthly
            </button>
          </div>

          {/* Active Plan Display */}
          {sdpEnabled && sdpPlan && (
            <p className="mt-3 text-green-600 font-medium">
              ✅ SDP Active: Auto-add funds {sdpPlan}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default WalletSection;
