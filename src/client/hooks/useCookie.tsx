import React from 'react'
import Cookies from 'js-cookie'

import useServer from './useServer'

export default function useCookie(key: string, initialValue: string): [string, (value: string) => void] {
  const server = useServer()
  const [storedValue, setStoredValue] = React.useState(() => {
    if (server) {
      const data = server.req.cookies[key]
      if (data === undefined) return initialValue
      return data
    }

    const cookie = Cookies.get(key)
    if (cookie === undefined) return initialValue
    return cookie
  })

  const setValue = (value) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value
    setStoredValue(valueToStore)
    Cookies.set(key, valueToStore, { path: '/' })
  }

  return [storedValue, setValue]
}
