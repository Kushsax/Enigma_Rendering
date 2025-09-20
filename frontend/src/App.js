
import HelloWorld from './pages/HelloWorld'; 
import { Navigate, Route, Routes } from "react-router-dom";
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import UserHome from "./pages/UserHome";
import CreatorHome from "./pages/CreatorHome";


function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Navigate to="/login"/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path="/hello" element={<HelloWorld />} /> 
        <Route path='/Home' element={<Home/>}/>
        <Route path="/user-home" element={<UserHome />} />
        <Route path="/creator-home" element={<CreatorHome />} />
      </Routes>

    </div>
  );
}

export default App;
