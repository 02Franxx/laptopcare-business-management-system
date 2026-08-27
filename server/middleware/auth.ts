import { lookupSession } from '../utils/session'

export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/') || event.path.startsWith('/api/auth/') || event.path === '/api/health') return
  const session = lookupSession(getCookie(event, 'laptopcare_session'))
  if (!session) throw createError({ statusCode: 401, statusMessage: 'Authentication required.' })
  event.context.user = session
})
