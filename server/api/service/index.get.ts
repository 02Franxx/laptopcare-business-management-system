import { prisma } from '../../utils/prisma'
export default defineEventHandler(() => prisma.repairService.findMany({ orderBy: { createdAt: 'desc' } }))
