export const useValueLock = (env: EnvInterface, name: string) => {
  let id = env.VALUE_LOCK.idFromName(name)
  let obj = env.VALUE_LOCK.get(id)

  const dummyUrl = 'https://dummy-url'
  return {
    lock: async (value: string) => {
      await obj.fetch(dummyUrl, {
        method: 'PUT',
        body: JSON.stringify({ action: 'lock', value })
      })
    },
    exists: async (value: string): Promise<boolean> => {
      const res = await obj.fetch(dummyUrl, {
        method: 'PUT',
        body: JSON.stringify({ action: 'exists', value })
      })

      return await res.json()
    }
  }
}

export class ValueLock implements DurableObject {
  values: string[]

  constructor(state: DurableObjectState, env: any) {
    this.values = []
  }

  async fetch(request: Request) {
    const { action, value } = await request.json()
    switch (action) {
      case 'lock':
        this.values.push(value)
        return new Response('Lock')
      case 'unlock':
        this.values = this.values.filter((u) => u !== value)
        return new Response('Unlocked')
      case 'exists':
        const exists = this.values.some(v => v === value)
        return new Response(JSON.stringify(exists))
      case 'list':
        return new Response(JSON.stringify(this.values))
      case 'clear':
        this.values = []
        return new Response('Cleared')
    }

    return new Response('Not found', { status: 404 })
  }
}
