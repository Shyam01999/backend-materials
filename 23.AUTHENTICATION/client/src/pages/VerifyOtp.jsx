import axios from 'axios';
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { serverUrl } from '../constants/api';
import { notifyError, notifySuccess } from '../constants/notification';

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  console.log("email", email)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post(`${serverUrl}/api/v1/verifyotp`, {
        email,
        otp
      }, { withCredentials: true });
      
      if (res.data.success) {
        notifySuccess(res.data.message);
        navigate("/");

      } else {
        notifyError(res.data.message)
      }

    }
    catch (error) {
      console.log(error);
      const message =
        error?.response?.data?.message || "Something went wrong";
      notifyError(message)
    }
    finally {
      setLoading(false)
    }

  }

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">Slow-carb next level shoindcgoitch ethical authentic, poko scenester</h1>
          <p className="leading-relaxed mt-4">Poke slow-carb mixtape knausgaard, typewriter street art gentrify hammock starladder roathse. Craies vegan tousled etsy austin.</p>
        </div>
        <form onSubmit={handleSubmit} className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <div className="relative mb-4">
            <label htmlFor="otp" className="leading-7 text-sm text-gray-600">OTP</label>
            <input
              type="otp"
              id="otp"
              name="otp"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              autoComplete='off'
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder='Enter OTP'
              required
            />
          </div>
          <button className="text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg" type='submit'>{loading ? "Submitting..." : "Login"}</button>
          <p className="text-xs text-gray-500 mt-3">Literally you probably haven't heard of them jean shorts.</p>
          <Link to={"/login"} className="text-xs text-gray-500 mt-3">Go to Login Page</Link>
        </form>
      </div>
    </section>
  )
}

export default VerifyOtp