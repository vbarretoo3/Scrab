import React from 'react'
import { Link } from 'react-router-dom'

function NavBar() {
  return (
    <div className='nav-bar-container'>
      <Link className='nav-bar-item' to='/dashboard'>Dashboard</Link>
      <Link className='nav-bar-item' to='/schedule'>Schedule</Link>
      <Link className='nav-bar-item' to='/payroll'>Payroll</Link>
      <Link className='nav-bar-item' to='/staff'>Staff</Link>
      <Link className='nav-bar-item' to='/options'>Options</Link>
    </div>
  )
}

export default NavBar