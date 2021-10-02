import useServerData from 'hooks/useServerData'
import React from 'react'

export default (): JSX.Element => {
  const inputText = React.useRef<HTMLInputElement>()
  const _items = useServerData('somedata', async () => {

    TEST_NAMESPACE1.get("key").then((value) => console.log(value))

    const data = await TEST_NAMESPACE1.list()
    if (data.keys.length === 0) TEST_NAMESPACE1.put('test', 'this is text')
    const value = await TEST_NAMESPACE1.get('test')
    return [value]
    //return []
    return await data.keys.map(async ({ name }) => await TEST_NAMESPACE1.get(name))
    console.log(data)
    return ['this is text', 'more text']
  }, [])

  const [items, setItems] = React.useState(_items)
  const addItem = React.useCallback(() => { 
    const { value } = inputText.current
    setItems([...items, value])
    inputText.current.value = ''
  }, [items])

  const clearItems = React.useCallback(() => setItems([]), [])

  return <div>
    <input ref={inputText} type="text" />
    <button onClick={addItem}>Add item</button>
    <button onClick={clearItems}>Clear</button>
    {items.map((item, index) => <div key={index}>{item}</div>)}
  </div>
}