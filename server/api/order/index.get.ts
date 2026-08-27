import { prisma } from '../../utils/prisma'
export default defineEventHandler(() => prisma.repairOrder.findMany({ include: { customer: true, service: true }, orderBy: { createdAt: 'desc' } }))
