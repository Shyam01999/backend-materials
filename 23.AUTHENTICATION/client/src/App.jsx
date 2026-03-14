import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Verify from './pages/Verify';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyOtp from './pages/VerifyOtp';
import { useDispatch, useSelector } from 'react-redux';
import { userDetails } from './redux/actions/auth.actions';
import Loading from './components/Loading';

const App = () => {
  const { loading, userData, isAuth, error } = useSelector((state) => state.userDetailsReducer);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userDetails())
  }, []);

  if (loading) {
    return <Loading />
  }


  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={isAuth ? <Home /> : <Login />}></Route>
        <Route path={"/login"} element={isAuth ? <Home /> : <Login />}></Route>
        <Route path={"/register"} element={isAuth ? <Home /> : <Register />}></Route>
        <Route path={"/verifyOtp"} element={isAuth ? <Home /> : <VerifyOtp />}></Route>

      </Routes>
    </BrowserRouter>
  )


}

export default App