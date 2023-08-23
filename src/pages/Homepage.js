import React from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'

function Homepage() {
  const navigate = useNavigate()
  const userData = sessionStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  return (
    <>
        <Header/>
        <h1>Hello {user ? user.Name : "Guest"}!</h1>
        <button onClick={() => navigate('/signup')} className='button-pill'>Start free Trial</button>
    </>
  )
}

export default Homepage
