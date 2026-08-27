import { prisma } from '../../utils/prisma'
export default defineEventHandler(async (event) => { const id = Number(getRouterParam(event, 'id')); if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid service id.' }); await prisma.repairService.delete({ where: { id } }); return { success: true } })
