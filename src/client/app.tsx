import React from 'react'
import Helmet from 'react-helmet'
import { Switch, Route } from 'react-router-dom'

import 'normalize.css'

import Home from './pages/Home'
import ManagePosts from './pages/ManagePosts'
import NotFound from './pages/NotFound'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'

import Menu from './components/Menu'
import { UserProvider } from 'hooks/useUser'
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
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/manage-posts" exact component={ManagePosts} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />
        <Route path="*" component={NotFound} />
      </Switch>
    </UserProvider>
  </>
}
