import { prisma } from '../../utils/prisma'
export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id')); const body = await readBody<{ name?: string; price?: number }>(event); const price = Number(body.price)
  if (!Number.isInteger(id) || !body.name?.trim() || !Number.isFinite(price) || price <= 0) throw createError({ statusCode: 400, statusMessage: 'Valid service details are required.' })
  return prisma.repairService.update({ where: { id }, data: { name: body.name.trim(), price } })
})
