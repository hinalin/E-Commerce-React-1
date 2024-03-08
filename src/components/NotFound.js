import React from 'react'
import NotFoundImage from '../assets/logo/404-not-found.gif';
import './NotFound.css'

function NotFound() {
  return (
    <div>
      <img className='notfoundimage' src={NotFoundImage} alt="No products found" />
    </div>
  )
}

export default NotFound
