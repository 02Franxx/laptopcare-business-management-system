import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { randomBytes, scrypt } from 'node:crypto'

const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: process.env.DATABASE_URL || 'file:./dev.db' }) })

const run = async () => {
  const salt = randomBytes(16).toString('hex')
  const hash = await new Promise((resolve, reject) => scrypt('admin123', salt, 64, (error, derived) => error ? reject(error) : resolve(derived.toString('hex'))))
  await prisma.user.upsert({ where: { username: 'admin' }, update: { passwordHash: `${salt}:${hash}` }, create: { username: 'admin', passwordHash: `${salt}:${hash}` } })

  const services = await Promise.all([
    prisma.repairService.upsert({ where: { id: 1 }, update: {}, create: { name: 'Screen Replacement', price: 380 } }),
    prisma.repairService.upsert({ where: { id: 2 }, update: {}, create: { name: 'Battery Replacement', price: 220 } }),
    prisma.repairService.upsert({ where: { id: 3 }, update: {}, create: { name: 'Laptop Cleaning', price: 80 } })
  ])
  const customers = await Promise.all([
    prisma.customer.upsert({ where: { id: 1 }, update: {}, create: { name: 'Alicia Tan', phone: '012-345 6789', email: 'alicia@example.com' } }),
    prisma.customer.upsert({ where: { id: 2 }, update: {}, create: { name: 'Daniel Lim', phone: '013-222 4567', email: 'daniel@example.com' } }),
    prisma.customer.upsert({ where: { id: 3 }, update: {}, create: { name: 'Marcus Lee', phone: '016-888 9012', email: 'marcus@example.com' } })
  ])
  if (await prisma.repairOrder.count() === 0) {
    await prisma.repairOrder.createMany({ data: [
      { customerId: customers[0].id, serviceId: services[0].id, laptopBrand: 'Apple', laptopModel: 'MacBook Pro', problem: 'Cracked display after a fall.', status: 'Pending' },
      { customerId: customers[1].id, serviceId: services[1].id, laptopBrand: 'Dell', laptopModel: 'XPS', problem: 'Battery drains within one hour.', status: 'In Progress' },
      { customerId: customers[2].id, serviceId: services[2].id, laptopBrand: 'Lenovo', laptopModel: 'ThinkPad', problem: 'Fan is noisy and the laptop overheats.', status: 'Completed' }
    ] })
  }
  console.log('Demo data seeded successfully.')
}

try { await run() } finally { await prisma.$disconnect() }
