const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000'
const checks = [['/api/health', 'health'], ['/api/customer', 'customer list'], ['/api/service', 'service list'], ['/api/order', 'order list'], ['/api/dashboard', 'dashboard']]
for (const [path, name] of checks.slice(0, 1)) {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) throw new Error(`${name} failed with ${response.status}`)
  console.log(`✓ ${name}`)
}
const login = await fetch(`${baseUrl}/api/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username: 'admin', password: 'admin123' }) })
if (!login.ok) throw new Error(`login failed with ${login.status}`)
const cookie = login.headers.get('set-cookie')?.split(';')[0] || ''
for (const [path, name] of checks.slice(1)) {
  const response = await fetch(`${baseUrl}${path}`, { headers: { cookie } })
  if (!response.ok) throw new Error(`${name} failed with ${response.status}`)
  console.log(`✓ ${name}`)
}
console.log('All API smoke checks passed.')
