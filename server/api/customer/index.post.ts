import { prisma } from '../../utils/prisma'

type CustomerInput = {
  name?: string
  phone?: string
  email?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CustomerInput>(event)
  const name = body.name?.trim()
  const phone = body.phone?.trim()
  const email = body.email?.trim().toLowerCase()

  if (!name || !/^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(name) || !/^\d[\d -]{6,20}\d$/.test(phone) || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Name, phone, and a valid email are required.' })
  }

  return prisma.customer.create({ data: { name, phone, email } })
})
