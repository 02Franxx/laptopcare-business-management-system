import { deleteSession } from '../../utils/session'
export default defineEventHandler((event) => { deleteSession(getCookie(event, 'laptopcare_session')); deleteCookie(event, 'laptopcare_session', { path: '/' }); return { success: true } })
