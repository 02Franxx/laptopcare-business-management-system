import { prisma } from '../../utils/prisma'
export default defineEventHandler(async (event) => {
  const body = await readBody<{ name?: string; price?: number }>(event)
  const price = Number(body.price)
  if (!body.name?.trim() || !Number.isFinite(price) || price <= 0) throw createError({ statusCode: 400, statusMessage: 'Valid service name and price are required.' })
  return prisma.repairService.create({ data: { name: body.name.trim(), price } })
})
