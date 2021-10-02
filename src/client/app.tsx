import React from 'react'
import Helmet from 'react-helmet'
import { Switch, Route } from 'react-router-dom'

import 'normalize.css'

import Home from './pages/home'
import Posts from './pages/posts'
import NotFound from './pages/404'

export default (): JSX.Element => {
  return <>
    <Helmet>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="/public/dist/index.css" />
    </Helmet>
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/posts" exact component={Posts} />
      <Route path="*" component={NotFound} />
    </Switch>
  </>
}
