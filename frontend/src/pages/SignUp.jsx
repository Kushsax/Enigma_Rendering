import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { name, email, password } = signupInfo;
    if (!name || !email || !password) {
      return handleError('name, email and password are required');
    }
    try {
      const url = `http://localhost:8080/auth/signup`; 
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupInfo),
      });
      const result = await response.json();
      const { success, message, error } = result;

      if (success) {
        handleSuccess(message);
        setTimeout(() => navigate('/login'), 1000);
      } else if (error) {
        handleError(error?.details[0].message);
      } else {
        handleError(message);
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 p-6">
        <h1 className="text-3xl font-bold mb-5 text-center text-base-content">
          Signup
        </h1>
        <form onSubmit={handleSignup} className="space-y-4">
          {/* Name */}
          <div className="form-control">
            <label htmlFor="name" className="label">
              <span className="label-text font-medium text-base-content">Name</span>
            </label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              autoFocus
              placeholder="Enter your name..."
              value={signupInfo.name}
              className="input input-bordered w-full bg-base-200 text-base-content"
            />
          </div>
          {/* Email */}
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text font-medium text-base-content">Email</span>
            </label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              placeholder="Enter your email..."
              value={signupInfo.email}
              className="input input-bordered w-full bg-base-200 text-base-content"
            />
          </div>
          {/* Password */}
          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text font-medium text-base-content">Password</span>
            </label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              placeholder="Enter your password..."
              value={signupInfo.password}
              className="input input-bordered w-full bg-base-200 text-base-content"
            />
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="btn btn-neutral w-full mt-2"
          >
            Signup
          </button>
          {/* Login link */}
          <p className="text-sm text-center text-base-content">
            Already have an account?{" "}
            <Link to="/login" className="link link-neutral">
              <span className='btn btn-link' >Login</span>  
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Signup;
