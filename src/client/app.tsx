import React from 'react'
import Helmet from 'react-helmet'
import { Routes, Route } from 'react-router-dom'

import 'normalize.css'

import Home from 'pages/Home'
import ManagePosts from 'pages/post/ManagePosts'
import NotFound from 'pages/errors/NotFound'
import Register from 'pages/auth/Register'
import Login from 'pages/auth/Login'
import ChangeUsername from 'pages/auth/ChangeUsername'

import { UserProvider } from 'hooks/useUser'

import Menu from 'components/Menu'
import LoggedIn from 'components/LoggedIn'

export default (): JSX.Element => {
  return <>
    <UserProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/public/dist/index.css" />
      </Helmet>
      <Menu />
      <LoggedIn />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/manage-posts" element={<ManagePosts />} />
        <Route path="/change-username" element={<ChangeUsername />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </UserProvider>
  </>
}
