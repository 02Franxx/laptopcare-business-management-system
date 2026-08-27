const sessions = new Map<string, { username: string; createdAt: number }>()

export const hashPassword = async (password: string) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = await new Promise<string>((resolve, reject) => crypto.scrypt(password, salt, 64, (error, derived) => error ? reject(error) : resolve(derived.toString('hex'))))
  return `${salt}:${hash}`
}

export const verifyPassword = async (password: string, stored: string) => {
  const [salt, expected] = stored.split(':')
  if (!salt || !expected) return false
  const actual = await new Promise<string>((resolve, reject) => crypto.scrypt(password, salt, 64, (error, derived) => error ? reject(error) : resolve(derived.toString('hex'))))
  return crypto.timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'))
}

export const createSession = (username: string) => {
  const token = `${crypto.randomUUID()}-${crypto.randomUUID()}`
  sessions.set(token, { username, createdAt: Date.now() })
  return token
}

export const lookupSession = (token?: string) => token ? sessions.get(token) : undefined
export const deleteSession = (token?: string) => { if (token) sessions.delete(token) }
