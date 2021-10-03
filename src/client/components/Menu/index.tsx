import React from 'react'
import { Link } from 'react-router-dom'

export default (): JSX.Element => {
  return <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/manage-posts">Manage posts</Link>
    </li>
    <li>
      <Link to="/login">Login</Link>
    </li>
    <li>
      <Link to="/register">Register</Link>
    </li>
  </ul>
}