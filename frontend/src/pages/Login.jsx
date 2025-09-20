import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
    role: 'user', // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password, role } = loginInfo;
    if (!email || !password) return handleError('Email and password are required');

    try {
      const url = `http://localhost:8080/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        // ✅ Only send email & password (not role)
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;

      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        localStorage.setItem('role', role); // keep role locally only

        setTimeout(() => {
          if (role === "creator") {
            navigate('/creator-home');
          } else {
            navigate('/user-home');
          }
        }, 1000);

      } else if (error) {
        handleError(error?.details[0]?.message || "Login failed");
      } else {
        handleError(message || "Something went wrong");
      }
    } catch (err) {
      handleError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-300 p-6">
        <h1 className="text-3xl font-bold mb-5 text-center text-base-content">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
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
              value={loginInfo.email}
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
              value={loginInfo.password}
              className="input input-bordered w-full bg-base-200 text-base-content"
            />
          </div>
          {/* Role Toggle */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-base-content">Login as</span>
            </label>
            <select
              name="role"
              value={loginInfo.role}
              onChange={handleChange}
              className="select select-bordered w-full bg-base-200 text-base-content"
            >
              <option value="user">User</option>
              <option value="creator">Creator</option>
            </select>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="btn btn-neutral w-full mt-2"
          >
            Login
          </button>
          {/* Signup link */}
          <p className="text-sm text-center text-base-content ">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="link link-neutral">
              <span className='btn btn-link'>Signup</span>  
            </Link>
          </p>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Login;
