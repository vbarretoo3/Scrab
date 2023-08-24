import React from 'react';
import logo from '../imgs/Scrab_dark_Logo.svg';
import { Link } from 'react-router-dom';

function ProtectedHeader() {
  const currentUser = sessionStorage.getItem('user');
  const user = JSON.parse(currentUser)

  return (
    <div className='protected-header-container'>
        <div className='header-right'>
          <Link to='/dashboard'>
            <img className='logo' src={logo} alt='Scrab'/>
          </Link>
        </div>
        <div className='protected-header-left'>
          {user.FirstName} {user.LastName}
        </div>
    </div>
  )
}

export default ProtectedHeader;