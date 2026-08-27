const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000'
const checks = [['/api/health', 'health'], ['/api/customer', 'customer list'], ['/api/service', 'service list'], ['/api/order', 'order list']]
for (const [path, name] of checks) {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) throw new Error(`${name} failed with ${response.status}`)
  console.log(`✓ ${name}`)
}
console.log('All API smoke checks passed.')
