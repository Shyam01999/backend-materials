import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/actions/auth.actions';

function Home() {
  const {loading, userData, isAuth, error} = useSelector((state) => state.userDetailsReducer);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  }
  
  return (
    <div className='flex w-[100px] m-auto mt-40'>
      <button className='bg-red-500 text-white p-2 rounded-md' onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home