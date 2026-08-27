import { prisma } from '../../utils/prisma'

export default defineEventHandler(async () => {
  const customers = await prisma.customer.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  })

  return customers
})