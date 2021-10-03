import { Router } from 'itty-router'
import { createElement } from 'react'
import Helmet from 'react-helmet'

import { renderApp, ServerDataContext } from 'hooks/useServerData'
import { ServerContext } from 'hooks/useServer'

import staticFiles from './staticFiles'
import template from './template'
import ServerApp from '../client/ssr'

import { addPost, getPost, getLatestPosts, delPost } from './post'
import register from './auth/register'
import login from './auth/login'
import changePassword from './auth/changePassword'
import changeUsername from './auth/changeUsername'
import { currentUser, logout, requiredUser, withUser } from './auth/user'

const router = Router()

// API
// POSTS
router.get('/api/posts/:key', getPost)
router.get('/api/posts-latest', getLatestPosts)
router.post('/api/posts', addPost)
router.delete('/api/posts/:key', delPost)

// AUTH / USERS
router.post('/api/auth/register', register)
router.post('/api/auth/login', withUser, login)
router.post('/api/auth/changeUsername', withUser, requiredUser, changeUsername)
router.post('/api/auth/changePassword', withUser, requiredUser, changePassword)
router.post('/api/auth/logout', withUser, requiredUser, logout)

// Handle static files
router.get('/public/*', staticFiles('public'))

// Match all routes
router.all('*', withUser, async (req, event: FetchEvent) => {
  const resInit = { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } } as ResponseInit
  const serverDataContext = { data: {}, funcs: {} } as ServerDataContext
  const serverContext = { req, res: resInit, event } as ServerContext
  const element = createElement(ServerApp, { serverContext, serverDataContext })
  const body = await renderApp(element, serverDataContext, serverContext)
  const helmet = Helmet.renderStatic() // call after react render!
  const { res } = serverContext
  const { data } = serverDataContext
  const html = template({ body, helmet, data })

  return new Response(html, res)
})

const errorHandler = error => {
  return new Response(error.message || 'Server Error', { status: error.status || 500 })
}

addEventListener("fetch", (event) => {
  const routeHandler = router.handle(event.request, event)
  event.respondWith(routeHandler)
})
