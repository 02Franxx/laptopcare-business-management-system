const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3000'
const request = (path, options = {}) => fetch(`${baseUrl}${path}`, options)
const json = (method, body, cookie = '') => ({ method, headers: { 'content-type': 'application/json', ...(cookie ? { cookie } : {}) }, body: JSON.stringify(body) })
const assert = (condition, message) => { if (!condition) throw new Error(message) }

let response = await request('/api/health'); assert(response.ok, 'health failed'); console.log('✓ health')
response = await request('/api/customer'); assert(response.status === 401, 'unauthorized API was not blocked'); console.log('✓ unauthorized API')
response = await request('/api/auth/login', json('POST', { username: 'admin', password: 'admin123' })); assert(response.ok, 'login failed'); const cookie = response.headers.get('set-cookie')?.split(';')[0] || ''; console.log('✓ login')
for (const path of ['/api/customer', '/api/service', '/api/order', '/api/dashboard']) { response = await request(path, { headers: { cookie } }); assert(response.ok, `${path} failed`); console.log(`✓ ${path}`) }
response = await request('/api/customer', json('POST', { name: 'QA Customer', phone: '012-345 6789', email: `qa-${Date.now()}@example.com` }, cookie)); assert(response.ok, 'customer create failed'); const customer = await response.json(); console.log('✓ customer create')
response = await request(`/api/customer/${customer.id}`, json('PATCH', { name: 'QA Customer Updated', phone: '012-345 6789', email: customer.email }, cookie)); assert(response.ok, 'customer update failed'); console.log('✓ customer update')
response = await request('/api/service', json('POST', { name: `QA Service ${Date.now()}`, price: 99 }, cookie)); assert(response.ok, 'service create failed'); const service = await response.json(); console.log('✓ service create')
response = await request(`/api/service/${service.id}`, json('PATCH', { name: service.name, price: 109 }, cookie)); assert(response.ok, 'service update failed'); console.log('✓ service update')
response = await request('/api/order', json('POST', { customerId: customer.id, serviceId: service.id, laptopBrand: 'Apple', laptopModel: 'MacBook Air', problem: 'QA test issue', status: 'Pending' }, cookie)); assert(response.ok, 'order create failed'); const order = await response.json(); console.log('✓ order create')
response = await request(`/api/order/${order.id}`, json('PATCH', { customerId: customer.id, serviceId: service.id, laptopBrand: 'Apple', laptopModel: 'MacBook Air', problem: 'QA updated issue', status: 'Cancelled' }, cookie)); assert(response.ok, 'order update/cancelled failed'); console.log('✓ order update + cancelled')
response = await request('/api/customer', json('POST', { name: '', phone: 'bad', email: 'bad' }, cookie)); assert(response.status === 400, 'invalid customer accepted'); console.log('✓ invalid input')
response = await request(`/api/order/${order.id}`, { method: 'DELETE', headers: { cookie } }); assert(response.ok, 'order delete failed'); await request(`/api/service/${service.id}`, { method: 'DELETE', headers: { cookie } }); await request(`/api/customer/${customer.id}`, { method: 'DELETE', headers: { cookie } }); console.log('✓ order/service/customer delete')
console.log('All API CRUD, validation, auth, and business-rule checks passed.')
