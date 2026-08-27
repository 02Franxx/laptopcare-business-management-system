import { createSession, hashPassword, verifyPassword } from '../../utils/session'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ username?: string; password?: string }>(event)
  const username = body.username?.trim()
  if (!username || !body.password) throw createError({ statusCode: 401, statusMessage: 'Username and password are required.' })
  let user = await prisma.user.findUnique({ where: { username } })
  if (!user) user = await prisma.user.create({ data: { username, passwordHash: await hashPassword(body.password) } })
  if (!(await verifyPassword(body.password, user.passwordHash))) throw createError({ statusCode: 401, statusMessage: 'Invalid username or password.' })
  const token = createSession(username)
  setCookie(event, 'laptopcare_session', token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 8, path: '/' })
  return { username }
})
