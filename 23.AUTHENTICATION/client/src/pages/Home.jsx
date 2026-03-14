import React from 'react'
import { useSelector } from 'react-redux'

function Home() {
  const {loading, userData, isAuth, error} = useSelector((state) => state.userDetailsReducer);
  const name = userData?.name || '';
  const email = userData?.email || '';
  const role = userData?.role || '';

  return (
    <div>
      <h1>Namaste, {name}</h1>
      <h2>Email: {email}</h2>
      <h2>Role: {role}</h2>
    </div>
  )
}

export default Home