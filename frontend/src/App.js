import { Navigate, Route, Routes } from "react-router-dom";
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import UserHome from "./pages/UserHome";
import CreatorHome from "./pages/CreatorHome";
import HelloWorld from './pages/HelloWorld'; 
import CreatorDashboard from "./pages/CreatorDashboard";
import ProjectDashboard from "./pages/ProjectDashboard";

function App() {
  return (
    <div>
      <Routes>
        {/* Default redirect */}
        <Route path='/' element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path="/creator-dashboard" element={<CreatorDashboard />} />

        {/* Extra pages */}
        <Route path="/hello" element={<HelloWorld />} /> 

        {/* Homes */}
        <Route path="/project/:id" element={<ProjectDashboard />} />
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/creator-home" element={<CreatorHome />} />
      </Routes>
    </div>
  );
}

export default App;
