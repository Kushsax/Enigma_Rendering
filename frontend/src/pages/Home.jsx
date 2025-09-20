import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    const jwtToken = localStorage.getItem('token');

    setLoggedInUser(user || '');
    setToken(jwtToken || '');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-lg border border-base-300">
        <div className="card-body items-center text-center space-y-4">
          <h1 className="text-2xl font-bold text-base-content">
            Welcome {loggedInUser || 'Guest'} 🎉
          </h1>

          {token && (
            <p className="text-xs text-base-content/70 break-all border border-base-300 rounded-md p-2 bg-base-200 w-full">
              <strong>JWT Token:</strong> {token}
            </p>
          )}

          <div className="card-actions flex flex-col gap-3 w-full">
            <button
              onClick={handleLogout}
              className="btn btn-neutral w-full"
            >
              Logout
            </button>

            <Link
              to="/hello"
              className="btn btn-outline btn-neutral w-full"
            >
              Go to Hello World
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Home;
