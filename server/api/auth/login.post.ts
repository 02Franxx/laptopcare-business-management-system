import { createSession } from '../../utils/session'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)
  const username = body.username?.trim()
  if (!username || !body.password) throw createError({ statusCode: 401, statusMessage: 'Username and password are required.' })
  const token = createSession(username)
  setCookie(event, 'laptopcare_session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 8, path: '/' })
  return { username }
})
