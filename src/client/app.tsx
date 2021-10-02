import React from 'react'
import Helmet from 'react-helmet'
import { Switch, Route } from 'react-router-dom'

import 'normalize.css'

import Home from './pages/home'
import Data from './pages/data'
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
      <Route path="/data" exact component={Data} />
      <Route path="*" component={NotFound} />
    </Switch>
  </>
}
