import { prisma } from '../utils/prisma'

export default defineEventHandler(async () => {
  const [customers, orders, pending, inProgress, completed, completedOrders] = await Promise.all([
    prisma.customer.count(), prisma.repairOrder.count(),
    prisma.repairOrder.count({ where: { status: 'Pending' } }),
    prisma.repairOrder.count({ where: { status: 'In Progress' } }),
    prisma.repairOrder.count({ where: { status: 'Completed' } }),
    prisma.repairOrder.findMany({ where: { status: 'Completed' }, include: { service: true } })
  ])
  return { customers, orders, pending, inProgress, completed, revenue: completedOrders.reduce((total, order) => total + order.service.price, 0) }
})
