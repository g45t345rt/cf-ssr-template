import React from 'react'

export default function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = React.useState(() => {
    try {
      if (window.localStorage) {
        const data = window.localStorage.getItem(key)
        return data ? JSON.parse(data) : initialValue
      }

      return initialValue
    } catch (err) {
      console.log(err)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      if (window.localStorage) {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        const data = JSON.stringify(valueToStore)
        window.localStorage.setItem(key, data)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return [storedValue, setValue]
}
