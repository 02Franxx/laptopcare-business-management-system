import { lookupSession } from '../../utils/session'
export default defineEventHandler((event) => { const session = lookupSession(getCookie(event, 'laptopcare_session')); if (!session) throw createError({ statusCode: 401, statusMessage: 'Authentication required.' }); return { username: session.username } })
