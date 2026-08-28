import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid customer id.' })
  const used = await prisma.repairOrder.count({ where: { customerId: id } })
  if (used) throw createError({ statusCode: 409, statusMessage: 'This customer has existing repair orders.' })
  await prisma.customer.delete({ where: { id } })
  return { success: true }
})
