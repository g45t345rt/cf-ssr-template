import React from 'react'

const globalState = {}

export default function useGlobalState<T>(key: string, initialState: T): [T, (value: T) => void] {
  const [state, _setState] = React.useState(() => {
    if (globalState[key]) {
      return globalState[key]
    } else {
      return initialState
    }
  })

  const setState = (newValue) => {
    globalState[key] = newValue
    _setState(newValue)
  }

  return [state, setState]
}
