const sessions = new Map<string, { username: string; createdAt: number }>()

export const createSession = (username: string) => {
  const token = `${crypto.randomUUID()}-${crypto.randomUUID()}`
  sessions.set(token, { username, createdAt: Date.now() })
  return token
}

export const lookupSession = (token?: string) => token ? sessions.get(token) : undefined
export const deleteSession = (token?: string) => { if (token) sessions.delete(token) }
