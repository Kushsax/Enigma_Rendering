import React from "react";

function UserHome() {
  const name = localStorage.getItem("loggedInUser");
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg bg-base-100 shadow-xl p-6 border border-base-300">
        <h1 className="text-3xl font-bold text-center mb-4">Welcome, {name} 👋</h1>
        <p className="text-center text-base-content">
          This is the <span className="font-semibold">User Dashboard</span>.
        </p>
      </div>
    </div>
  );
}

export default UserHome;
