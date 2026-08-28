import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const body = await readBody<{ name?: string; phone?: string; email?: string }>(event)
  if (!Number.isInteger(id) || !body.name?.trim() || !/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(body.name.trim()) || !/^\d[\d -]{6,20}\d$/.test(body.phone.trim()) || !body.email?.trim() || !/^\S+@\S+\.\S+$/.test(body.email.trim())) {
    throw createError({ statusCode: 400, statusMessage: 'Valid customer details are required.' })
  }
  return prisma.customer.update({ where: { id }, data: { name: body.name.trim(), phone: body.phone.trim(), email: body.email.trim().toLowerCase() } })
})
