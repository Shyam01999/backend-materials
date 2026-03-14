import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
            <Route path={"/"} element={<Home />}></Route>
            <Route path={"/login"} element={<Login />}></Route>
            <Route path={"/register"} element={<Register />}></Route>
            <Route path={"/verifyOtp"} element={<VerifyOtp/>}></Route>
          
      </Routes>
    </BrowserRouter>
  )
}

export default App