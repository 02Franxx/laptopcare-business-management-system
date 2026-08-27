<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// ================================
// Login
// ================================

const username = ref('')
const password = ref('')
const isLoggedIn = ref(false)
const currentUser = ref('')

// ================================
// Page Navigation
// ================================

const currentPage = ref('dashboard')

// ================================
// Customer
// ================================

const customerName = ref('')
const customerPhone = ref('')
const customerEmail = ref('')

const customers = ref([])
const editingCustomerIndex = ref(null)

// Add Customer
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email)

const addCustomer = async () => {
  if (
    customerName.value &&
    customerPhone.value &&
    customerEmail.value &&
    isValidEmail(customerEmail.value)
  ) {
    try {
      const newCustomer = await $fetch('/api/customer', {
        method: 'POST',
        body: {
          name: customerName.value,
          phone: customerPhone.value,
          email: customerEmail.value
        }
      })

      customers.value.unshift(newCustomer)

      cancelCustomerEdit()
    } catch (error) {
      console.error('Failed to add customer:', error)
    }
  }
}

// Edit Customer
const editCustomer = (index) => {
  const customer = customers.value[index]

  customerName.value = customer.name
  customerPhone.value = customer.phone
  customerEmail.value = customer.email

  editingCustomerIndex.value = index
}

// Update Customer
const updateCustomer = async () => {
  if (
    customerName.value &&
    customerPhone.value &&
    customerEmail.value
  ) {
    const customer = customers.value[editingCustomerIndex.value]
    if (!isValidEmail(customerEmail.value) || !customer?.id) return
    const updated = await $fetch(`/api/customer/${customer.id}`, { method: 'PATCH', body: { name: customerName.value, phone: customerPhone.value, email: customerEmail.value } })
    customers.value[editingCustomerIndex.value] = updated

    customerName.value = ''
    customerPhone.value = ''
    customerEmail.value = ''

    editingCustomerIndex.value = null
  }
}

// Cancel Customer Edit
const cancelCustomerEdit = () => {
  customerName.value = ''
  customerPhone.value = ''
  customerEmail.value = ''

  editingCustomerIndex.value = null
}

// Delete Customer
const deleteCustomer = async (index) => {
  const customer = customers.value[index]
  if (!customer?.id) return
  await $fetch(`/api/customer/${customer.id}`, { method: 'DELETE' })
  customers.value.splice(index, 1)
}

// ================================
// Repair Service
// ================================

const serviceName = ref('')
const servicePrice = ref('')

const repairServices = ref([])
const editingServiceIndex = ref(null)

// Add Repair Service
const addRepairService = async () => {
  if (
    serviceName.value &&
    servicePrice.value
  ) {
    const created = await $fetch('/api/service', { method: 'POST', body: { name: serviceName.value, price: Number(servicePrice.value) } })
    repairServices.value.unshift(created)

    serviceName.value = ''
    servicePrice.value = ''
  }
}

// Edit Repair Service
const editRepairService = (index) => {
  const service = repairServices.value[index]

  serviceName.value = service.name
  servicePrice.value = service.price

  editingServiceIndex.value = index
}

// Update Repair Service
const updateRepairService = async () => {
  if (
    serviceName.value &&
    servicePrice.value
  ) {
    const service = repairServices.value[editingServiceIndex.value]
    const updated = await $fetch(`/api/service/${service.id}`, { method: 'PATCH', body: { name: serviceName.value, price: Number(servicePrice.value) } })
    repairServices.value[editingServiceIndex.value] = updated

    serviceName.value = ''
    servicePrice.value = ''

    editingServiceIndex.value = null
  }
}

// Cancel Service Edit
const cancelServiceEdit = () => {
  serviceName.value = ''
  servicePrice.value = ''

  editingServiceIndex.value = null
}

// Delete Repair Service
const deleteRepairService = async (index) => {
  await $fetch(`/api/service/${repairServices.value[index].id}`, { method: 'DELETE' })
  repairServices.value.splice(index, 1)
}

// ================================
// Laptop Brand & Model
// ================================

const selectedBrand = ref('')
const selectedModel = ref('')

const laptopBrands = {
  Apple: [
    'MacBook Air',
    'MacBook Pro'
  ],

  Dell: [
    'Inspiron',
    'XPS',
    'Latitude'
  ],

  HP: [
    'Pavilion',
    'Victus',
    'EliteBook'
  ],

  ASUS: [
    'VivoBook',
    'ZenBook',
    'ROG'
  ],

  Lenovo: [
    'IdeaPad',
    'ThinkPad',
    'Legion'
  ],

  Acer: [
    'Aspire',
    'Swift',
    'Nitro'
  ]
}

// Change Brand
const changeBrand = () => {
  selectedModel.value = ''
}

// ================================
// Repair Order
// ================================

const selectedCustomer = ref('')
const problemDescription = ref('')
const selectedService = ref('')
const repairStatus = ref('Pending')

const repairOrders = ref([])
const editingOrderIndex = ref(null)

// Add Repair Order
const addRepairOrder = async () => {
  if (
    selectedCustomer.value !== '' &&
    selectedBrand.value !== '' &&
    selectedModel.value !== '' &&
    problemDescription.value &&
    selectedService.value !== ''
  ) {
    const customer = customers.value.find(item => item.name === selectedCustomer.value)
    const service = repairServices.value.find(item => item.name === selectedService.value)
    if (!customer?.id || !service?.id) return
    const created = await $fetch('/api/order', { method: 'POST', body: { customerId: customer.id, serviceId: service.id, laptopBrand: selectedBrand.value, laptopModel: selectedModel.value, problem: problemDescription.value, status: repairStatus.value } })
    repairOrders.value.unshift({ id: created.id, customer: created.customer.name, brand: created.laptopBrand, model: created.laptopModel, problem: created.problem, service: created.service.name, status: created.status, customerId: created.customerId, serviceId: created.serviceId })

    clearRepairOrderForm()
  }
}

// Edit Repair Order
const editRepairOrder = (index) => {
  const order = repairOrders.value[index]

  selectedCustomer.value = order.customer
  selectedBrand.value = order.brand
  selectedModel.value = order.model
  problemDescription.value = order.problem
  selectedService.value = order.service
  repairStatus.value = order.status

  editingOrderIndex.value = index
}

// Update Repair Order
const updateRepairOrder = async () => {
  if (
    selectedCustomer.value !== '' &&
    selectedBrand.value !== '' &&
    selectedModel.value !== '' &&
    problemDescription.value &&
    selectedService.value !== ''
  ) {
    const order = repairOrders.value[editingOrderIndex.value]
    const customer = customers.value.find(item => item.name === selectedCustomer.value)
    const service = repairServices.value.find(item => item.name === selectedService.value)
    const updated = await $fetch(`/api/order/${order.id}`, { method: 'PATCH', body: { customerId: customer.id, serviceId: service.id, laptopBrand: selectedBrand.value, laptopModel: selectedModel.value, problem: problemDescription.value, status: repairStatus.value } })
    repairOrders.value[editingOrderIndex.value] = { id: updated.id, customer: updated.customer.name, brand: updated.laptopBrand, model: updated.laptopModel, problem: updated.problem, service: updated.service.name, status: updated.status, customerId: updated.customerId, serviceId: updated.serviceId }

    clearRepairOrderForm()
  }
}

// Cancel Order Edit
const cancelOrderEdit = () => {
  clearRepairOrderForm()
}

// Delete Repair Order
const deleteRepairOrder = async (index) => {
  await $fetch(`/api/order/${repairOrders.value[index].id}`, { method: 'DELETE' })
  repairOrders.value.splice(index, 1)

  if (editingOrderIndex.value === index) {
    clearRepairOrderForm()
  }
}

// Clear Repair Order Form
const clearRepairOrderForm = () => {
  selectedCustomer.value = ''
  selectedBrand.value = ''
  selectedModel.value = ''
  problemDescription.value = ''
  selectedService.value = ''
  repairStatus.value = 'Pending'

  editingOrderIndex.value = null
}

// ================================
// Dashboard
// ================================

const totalCustomers = computed(() => {
  return customers.value.length
})

const totalRepairOrders = computed(() => {
  return repairOrders.value.length
})

const pendingOrders = computed(() => {
  return repairOrders.value.filter(
    order => order.status === 'Pending'
  ).length
})

const inProgressOrders = computed(() => {
  return repairOrders.value.filter(
    order => order.status === 'In Progress'
  ).length
})

const completedOrders = computed(() => {
  return repairOrders.value.filter(
    order => order.status === 'Completed'
  ).length
})

// ================================
// Login
// ================================

const login = async () => {
  if (
    username.value &&
    password.value
  ) {
    try {
      const session = await $fetch('/api/auth/login', { method: 'POST', body: { username: username.value, password: password.value } })
      currentUser.value = session.username
      isLoggedIn.value = true
      currentPage.value = 'dashboard'
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
}

// Logout
const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  isLoggedIn.value = false

  username.value = ''
  password.value = ''
  currentUser.value = ''

  currentPage.value = 'dashboard'
}

// ================================
// Local Storage
// ================================

const loadCustomers = async () => {
  try {
    customers.value = await $fetch('/api/customer')
  } catch (error) {
    console.error('Failed to load customers:', error)
  }
}

const loadServices = async () => { repairServices.value = await $fetch('/api/service') }
const loadOrders = async () => {
  const rows = await $fetch('/api/order')
  repairOrders.value = rows.map(row => ({ id: row.id, customer: row.customer.name, brand: row.laptopBrand, model: row.laptopModel, problem: row.problem, service: row.service.name, status: row.status, customerId: row.customerId, serviceId: row.serviceId }))
}

onMounted(() => {
  loadCustomers()
  loadServices()
  loadOrders()
})
</script>

<template>

  <!-- ================================ -->
  <!-- LOGIN PAGE -->
  <!-- ================================ -->

  <div
    v-if="!isLoggedIn"
    class="login-page"
  >
    <div class="login-card">

      <div class="login-logo">
        🛠
      </div>

      <h1>Laptop Repair</h1>

      <p class="login-subtitle">
        Service Management System
      </p>

      <div class="form-group">
        <label>Username</label>

        <input
          v-model="username"
          type="text"
          placeholder="Enter your username"
        />
      </div>

      <div class="form-group">
        <label>Password</label>

        <input
          v-model="password"
          type="password"
          placeholder="Enter your password"
        />
      </div>

      <button
        class="primary-button login-button"
        @click="login"
      >
        Login
      </button>

    </div>
  </div>


  <!-- ================================ -->
  <!-- MAIN SYSTEM -->
  <!-- ================================ -->

  <div
    v-else
    class="app-layout"
  >

    <!-- Sidebar -->

    <aside class="sidebar">

      <div class="sidebar-brand">

        <div class="brand-icon">
          🛠
        </div>

        <div>
          <h2>Laptop Repair</h2>
          <p>Management System</p>
        </div>

      </div>


      <!-- Navigation -->

      <nav class="sidebar-menu">

        <button
          class="nav-item"
          :class="{ active: currentPage === 'dashboard' }"
          @click="currentPage = 'dashboard'"
        >
          <span class="nav-icon">🏠</span>
          Dashboard
        </button>

        <button
          class="nav-item"
          :class="{ active: currentPage === 'customers' }"
          @click="currentPage = 'customers'"
        >
          <span class="nav-icon">👥</span>
          Customers
        </button>

        <button
          class="nav-item"
          :class="{ active: currentPage === 'services' }"
          @click="currentPage = 'services'"
        >
          <span class="nav-icon">🔧</span>
          Repair Services
        </button>

        <button
          class="nav-item"
          :class="{ active: currentPage === 'orders' }"
          @click="currentPage = 'orders'"
        >
          <span class="nav-icon">📋</span>
          Repair Orders
        </button>

      </nav>


      <!-- Sidebar Bottom -->

      <div class="sidebar-bottom">

        <div class="user-info">

          <div class="user-avatar">
            {{ currentUser.charAt(0).toUpperCase() }}
          </div>

          <div>
            <span class="user-label">
              Logged in as
            </span>

            <strong>
              {{ currentUser }}
            </strong>
          </div>

        </div>

        <button
          class="logout-button"
          @click="logout"
        >
          🚪 Logout
        </button>

      </div>

    </aside>


    <!-- Main Content -->

    <main class="main-content">

      <!-- Top Header -->

      <header class="top-header">

        <div>
          <p class="header-small">
            Laptop Repair Service System
          </p>

          <h1>
            {{
              currentPage === 'dashboard'
                ? 'Dashboard'
                : currentPage === 'customers'
                  ? 'Customers'
                  : currentPage === 'services'
                    ? 'Repair Services'
                    : 'Repair Orders'
            }}
          </h1>
        </div>

        <div class="header-user">
          Welcome, <strong>{{ currentUser }}</strong>
        </div>

      </header>


      <!-- ================================ -->
      <!-- DASHBOARD -->
      <!-- ================================ -->

      <section
        v-if="currentPage === 'dashboard'"
        class="page-content"
      >

        <div class="page-title">
          <div>
            <h2>Overview</h2>

            <p>
              Monitor your laptop repair business at a glance.
            </p>
          </div>
        </div>


        <!-- Statistics Cards -->

        <div class="stats-grid">

          <div class="stat-card">

            <div class="stat-icon">
              👥
            </div>

            <div>
              <p>Total Customers</p>
              <h3>{{ totalCustomers }}</h3>
            </div>

          </div>


          <div class="stat-card">

            <div class="stat-icon">
              📋
            </div>

            <div>
              <p>Total Orders</p>
              <h3>{{ totalRepairOrders }}</h3>
            </div>

          </div>


          <div class="stat-card">

            <div class="stat-icon">
              ⏳
            </div>

            <div>
              <p>Pending</p>
              <h3>{{ pendingOrders }}</h3>
            </div>

          </div>


          <div class="stat-card">

            <div class="stat-icon">
              🔧
            </div>

            <div>
              <p>In Progress</p>
              <h3>{{ inProgressOrders }}</h3>
            </div>

          </div>


          <div class="stat-card">

            <div class="stat-icon">
              ✅
            </div>

            <div>
              <p>Completed</p>
              <h3>{{ completedOrders }}</h3>
            </div>

          </div>

        </div>


        <!-- Quick Actions -->

        <div class="dashboard-section">

          <h2>Quick Actions</h2>

          <div class="quick-actions">

            <button
              class="quick-action-card"
              @click="currentPage = 'customers'"
            >
              <span>👥</span>
              <div>
                <strong>Manage Customers</strong>
                <p>Add or update customer information</p>
              </div>
            </button>

            <button
              class="quick-action-card"
              @click="currentPage = 'services'"
            >
              <span>🔧</span>
              <div>
                <strong>Manage Services</strong>
                <p>Manage repair services and pricing</p>
              </div>
            </button>

            <button
              class="quick-action-card"
              @click="currentPage = 'orders'"
            >
              <span>📋</span>
              <div>
                <strong>Create Repair Order</strong>
                <p>Create and manage repair orders</p>
              </div>
            </button>

          </div>

        </div>

      </section>


      <!-- ================================ -->
      <!-- CUSTOMER PAGE -->
      <!-- ================================ -->

      <section
        v-else-if="currentPage === 'customers'"
        class="page-content"
      >

        <div class="page-title">
          <div>
            <h2>Customer Management</h2>
            <p>Manage your customer information.</p>
          </div>

          <span class="record-count">
            {{ customers.length }} Customers
          </span>
        </div>


        <div class="content-grid">

          <!-- Form -->

          <div class="form-card">

            <h3>
              {{
                editingCustomerIndex === null
                  ? 'Add New Customer'
                  : 'Edit Customer'
              }}
            </h3>

            <div class="form-group">
              <label>Customer Name</label>

              <input
                v-model="customerName"
                type="text"
                placeholder="Enter customer name"
              />
            </div>

            <div class="form-group">
              <label>Phone Number</label>

              <input
                v-model="customerPhone"
                type="text"
                placeholder="Enter phone number"
              />
            </div>

            <div class="form-group">
              <label>Email Address</label>

              <input
                v-model="customerEmail"
                type="email"
                placeholder="Enter email address"
              />
            </div>


            <div class="button-group">

              <button
                v-if="editingCustomerIndex === null"
                class="primary-button"
                @click="addCustomer"
              >
                Add Customer
              </button>

              <button
                v-else
                class="primary-button"
                @click="updateCustomer"
              >
                Update Customer
              </button>

              <button
                v-if="editingCustomerIndex !== null"
                class="secondary-button"
                @click="cancelCustomerEdit"
              >
                Cancel
              </button>

            </div>

          </div>


          <!-- Customer List -->

          <div class="list-card">

            <div class="card-header">
              <h3>Customer List</h3>
            </div>

            <div
              v-if="customers.length === 0"
              class="empty-state"
            >
              <span>👥</span>
              <h3>No Customers Yet</h3>
              <p>Add your first customer using the form.</p>
            </div>


            <div
              v-for="(customer, index) in customers"
              :key="index"
              class="list-item"
            >

              <div class="list-item-info">

                <div class="list-avatar">
                  {{ customer.name.charAt(0).toUpperCase() }}
                </div>

                <div>
                  <h4>{{ customer.name }}</h4>

                  <p>
                    📞 {{ customer.phone }}
                  </p>

                  <p>
                    ✉️ {{ customer.email }}
                  </p>
                </div>

              </div>


              <div class="action-buttons">

                <button
                  class="edit-button"
                  @click="editCustomer(index)"
                >
                  Edit
                </button>

                <button
                  class="delete-button"
                  @click="deleteCustomer(index)"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- ================================ -->
      <!-- REPAIR SERVICES PAGE -->
      <!-- ================================ -->

      <section
        v-else-if="currentPage === 'services'"
        class="page-content"
      >

        <div class="page-title">
          <div>
            <h2>Repair Service Management</h2>
            <p>Manage your available repair services.</p>
          </div>

          <span class="record-count">
            {{ repairServices.length }} Services
          </span>
        </div>


        <div class="content-grid">

          <!-- Service Form -->

          <div class="form-card">

            <h3>
              {{
                editingServiceIndex === null
                  ? 'Add Repair Service'
                  : 'Edit Repair Service'
              }}
            </h3>

            <div class="form-group">
              <label>Service Name</label>

              <input
                v-model="serviceName"
                type="text"
                placeholder="Example: Screen Replacement"
              />
            </div>

            <div class="form-group">
              <label>Service Price (RM)</label>

              <input
                v-model="servicePrice"
                type="number"
                placeholder="Enter service price"
              />
            </div>


            <div class="button-group">

              <button
                v-if="editingServiceIndex === null"
                class="primary-button"
                @click="addRepairService"
              >
                Add Service
              </button>

              <button
                v-else
                class="primary-button"
                @click="updateRepairService"
              >
                Update Service
              </button>

              <button
                v-if="editingServiceIndex !== null"
                class="secondary-button"
                @click="cancelServiceEdit"
              >
                Cancel
              </button>

            </div>

          </div>


          <!-- Service List -->

          <div class="list-card">

            <div class="card-header">
              <h3>Repair Service List</h3>
            </div>

            <div
              v-if="repairServices.length === 0"
              class="empty-state"
            >
              <span>🔧</span>
              <h3>No Services Yet</h3>
              <p>Add your first repair service.</p>
            </div>


            <div
              v-for="(service, index) in repairServices"
              :key="index"
              class="list-item"
            >

              <div class="service-info">

                <div class="service-icon">
                  🔧
                </div>

                <div>
                  <h4>{{ service.name }}</h4>

                  <p>
                    Service Price
                  </p>
                </div>

              </div>


              <div class="service-right">

                <strong class="price">
                  RM {{ service.price }}
                </strong>

                <div class="action-buttons">

                  <button
                    class="edit-button"
                    @click="editRepairService(index)"
                  >
                    Edit
                  </button>

                  <button
                    class="delete-button"
                    @click="deleteRepairService(index)"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      <!-- ================================ -->
      <!-- REPAIR ORDER PAGE -->
      <!-- ================================ -->

      <section
        v-else-if="currentPage === 'orders'"
        class="page-content"
      >

        <div class="page-title">
          <div>
            <h2>Repair Order Management</h2>
            <p>Create and manage laptop repair orders.</p>
          </div>

          <span class="record-count">
            {{ repairOrders.length }} Orders
          </span>
        </div>


        <!-- Repair Order Form -->

        <div class="wide-form-card">

          <h3>
            {{
              editingOrderIndex === null
                ? 'Create Repair Order'
                : 'Edit Repair Order'
            }}
          </h3>


          <div class="form-grid">

            <div class="form-group">
              <label>Customer</label>

              <select v-model="selectedCustomer">

                <option value="">
                  Select Customer
                </option>

                <option
                  v-for="(customer, index) in customers"
                  :key="index"
                  :value="customer.name"
                >
                  {{ customer.name }}
                </option>

              </select>
            </div>


            <div class="form-group">
              <label>Laptop Brand</label>

              <select
                v-model="selectedBrand"
                @change="changeBrand"
              >

                <option value="">
                  Select Brand
                </option>

                <option
                  v-for="(models, brand) in laptopBrands"
                  :key="brand"
                  :value="brand"
                >
                  {{ brand }}
                </option>

              </select>
            </div>


            <div class="form-group">
              <label>Laptop Model</label>

              <select
                v-model="selectedModel"
                :disabled="!selectedBrand"
              >

                <option value="">
                  Select Model
                </option>

                <option
                  v-for="model in laptopBrands[selectedBrand]"
                  :key="model"
                  :value="model"
                >
                  {{ model }}
                </option>

              </select>
            </div>


            <div class="form-group">
              <label>Repair Service</label>

              <select v-model="selectedService">

                <option value="">
                  Select Repair Service
                </option>

                <option
                  v-for="(service, index) in repairServices"
                  :key="index"
                  :value="service.name"
                >
                  {{ service.name }} - RM {{ service.price }}
                </option>

              </select>
            </div>


            <div class="form-group">
              <label>Repair Status</label>

              <select v-model="repairStatus">

                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>

              </select>
            </div>

          </div>


          <div class="form-group">
            <label>Problem Description</label>

            <textarea
              v-model="problemDescription"
              placeholder="Describe the laptop problem"
            ></textarea>
          </div>


          <div class="button-group">

            <button
              v-if="editingOrderIndex === null"
              class="primary-button"
              @click="addRepairOrder"
            >
              Create Repair Order
            </button>

            <button
              v-else
              class="primary-button"
              @click="updateRepairOrder"
            >
              Update Repair Order
            </button>

            <button
              v-if="editingOrderIndex !== null"
              class="secondary-button"
              @click="cancelOrderEdit"
            >
              Cancel Edit
            </button>

          </div>

        </div>


        <!-- Repair Order List -->

        <div class="orders-section">

          <h2>Repair Order List</h2>

          <div
            v-if="repairOrders.length === 0"
            class="empty-state large-empty"
          >
            <span>📋</span>
            <h3>No Repair Orders Yet</h3>
            <p>Create your first repair order above.</p>
          </div>


          <div class="order-grid">

            <div
              v-for="(order, index) in repairOrders"
              :key="index"
              class="order-card"
            >

              <div class="order-card-header">

                <div>
                  <span class="order-number">
                    Order #{{ index + 1 }}
                  </span>

                  <h3>{{ order.customer }}</h3>
                </div>

                <span
                  class="status-badge"
                  :class="{
                    pending: order.status === 'Pending',
                    progress: order.status === 'In Progress',
                    completed: order.status === 'Completed'
                  }"
                >
                  {{ order.status }}
                </span>

              </div>


              <div class="order-details">

                <div>
                  <span>💻 Laptop</span>
                  <strong>
                    {{ order.brand }} {{ order.model }}
                  </strong>
                </div>

                <div>
                  <span>🔧 Service</span>
                  <strong>
                    {{ order.service }}
                  </strong>
                </div>

                <div class="problem-detail">
                  <span>⚠️ Problem</span>
                  <p>
                    {{ order.problem }}
                  </p>
                </div>

              </div>


              <div class="order-actions">

                <button
                  class="edit-button"
                  @click="editRepairOrder(index)"
                >
                  Edit
                </button>

                <button
                  class="delete-button"
                  @click="deleteRepairOrder(index)"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>

  </div>

</template>


<style>
/* ================================ */
/* GLOBAL */
/* ================================ */

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    Arial,
    Helvetica,
    sans-serif;
  background: #f4f7fb;
  color: #1f2937;
}

button,
input,
select,
textarea {
  font: inherit;
}

/* ================================ */
/* LOGIN */
/* ================================ */

.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background:
    linear-gradient(
      135deg,
      #1e293b,
      #334155
    );
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: white;
  border-radius: 18px;
  box-shadow:
    0 20px 60px
    rgba(0, 0, 0, 0.2);
}

.login-logo {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  border-radius: 18px;
  font-size: 32px;
  background: #e0f2fe;
}

.login-card h1 {
  margin: 0;
  font-size: 28px;
}

.login-subtitle {
  margin-top: 8px;
  margin-bottom: 30px;
  color: #64748b;
}

.login-button {
  width: 100%;
  margin-top: 10px;
}

/* ================================ */
/* APP LAYOUT */
/* ================================ */

.app-layout {
  min-height: 100vh;
  display: flex;
  background: #f4f7fb;
}

/* ================================ */
/* SIDEBAR */
/* ================================ */

.sidebar {
  width: 260px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  background: #1e293b;
  color: white;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px 30px;
  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.1);
}

.brand-icon {
  width: 46px;
  height: 46px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #2563eb;
  font-size: 22px;
}

.sidebar-brand h2 {
  margin: 0;
  font-size: 17px;
}

.sidebar-brand p {
  margin: 3px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 30px;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 15px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #cbd5e1;
  text-align: left;
  cursor: pointer;
  transition: 0.2s;
}

.nav-item:hover {
  background:
    rgba(255, 255, 255, 0.08);
  color: white;
}

.nav-item.active {
  background: #2563eb;
  color: white;
}

.nav-icon {
  width: 24px;
  text-align: center;
}

.sidebar-bottom {
  margin-top: auto;
  padding-top: 25px;
  border-top:
    1px solid
    rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.user-avatar {
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: #475569;
  font-weight: bold;
}

.user-label {
  display: block;
  margin-bottom: 3px;
  font-size: 11px;
  color: #94a3b8;
}

.user-info strong {
  display: block;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

.logout-button {
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
  cursor: pointer;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.25);
}

/* ================================ */
/* MAIN CONTENT */
/* ================================ */

.main-content {
  flex: 1;
  min-width: 0;
}

.top-header {
  min-height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.header-small {
  margin: 0 0 5px;
  font-size: 13px;
  color: #94a3b8;
}

.top-header h1 {
  margin: 0;
  font-size: 26px;
}

.header-user {
  padding: 10px 16px;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
}

.header-user strong {
  color: #1e293b;
}

.page-content {
  padding: 35px 40px;
}

.page-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.page-title h2 {
  margin: 0 0 8px;
  font-size: 25px;
}

.page-title p {
  margin: 0;
  color: #64748b;
}

.record-count {
  padding: 9px 14px;
  border-radius: 20px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 13px;
  font-weight: bold;
}

/* ================================ */
/* DASHBOARD */
/* ================================ */

.stats-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(180px, 1fr));
  gap: 18px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 22px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: white;
  box-shadow:
    0 3px 10px
    rgba(15, 23, 42, 0.04);
}

.stat-icon {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  background: #eff6ff;
  font-size: 23px;
}

.stat-card p {
  margin: 0 0 5px;
  color: #64748b;
  font-size: 13px;
}

.stat-card h3 {
  margin: 0;
  font-size: 28px;
}

.dashboard-section {
  margin-top: 35px;
}

.dashboard-section h2 {
  margin-bottom: 18px;
}

.quick-actions {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.quick-action-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 22px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: 0.2s;
}

.quick-action-card:hover {
  transform: translateY(-2px);
  border-color: #93c5fd;
  box-shadow:
    0 8px 20px
    rgba(15, 23, 42, 0.08);
}

.quick-action-card > span {
  font-size: 28px;
}

.quick-action-card strong {
  display: block;
  margin-bottom: 5px;
}

.quick-action-card p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

/* ================================ */
/* FORM & LIST */
/* ================================ */

.content-grid {
  display: grid;
  grid-template-columns:
    minmax(280px, 380px)
    minmax(0, 1fr);
  gap: 25px;
}

.form-card,
.list-card,
.wide-form-card {
  padding: 25px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: white;
  box-shadow:
    0 3px 10px
    rgba(15, 23, 42, 0.04);
}

.form-card h3,
.list-card h3,
.wide-form-card h3 {
  margin-top: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.form-group label {
  font-size: 13px;
  font-weight: bold;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #d1d5db;
  border-radius: 9px;
  outline: none;
  background: white;
  transition: 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #2563eb;
  box-shadow:
    0 0 0 3px
    rgba(37, 99, 235, 0.1);
}

.form-group textarea {
  min-height: 120px;
  resize: vertical;
}

.form-group select:disabled {
  background: #f1f5f9;
  color: #94a3b8;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.primary-button,
.secondary-button,
.edit-button,
.delete-button {
  border: none;
  border-radius: 9px;
  padding: 11px 16px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.2s;
}

.primary-button {
  background: #2563eb;
  color: white;
}

.primary-button:hover {
  background: #1d4ed8;
}

.secondary-button {
  background: #e5e7eb;
  color: #374151;
}

.secondary-button:hover {
  background: #d1d5db;
}

.edit-button {
  background: #dbeafe;
  color: #1d4ed8;
}

.edit-button:hover {
  background: #bfdbfe;
}

.delete-button {
  background: #fee2e2;
  color: #dc2626;
}

.delete-button:hover {
  background: #fecaca;
}

/* ================================ */
/* LIST */
/* ================================ */

.card-header {
  padding-bottom: 15px;
  border-bottom: 1px solid #e5e7eb;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 18px 0;
  border-bottom: 1px solid #eef2f7;
}

.list-item:last-child {
  border-bottom: none;
}

.list-item-info,
.service-info {
  display: flex;
  align-items: center;
  gap: 13px;
}

.list-avatar,
.service-icon {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 12px;
  background: #eff6ff;
  color: #2563eb;
  font-weight: bold;
}

.list-item h4,
.service-info h4 {
  margin: 0 0 6px;
}

.list-item p,
.service-info p {
  margin: 3px 0;
  color: #64748b;
  font-size: 13px;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.service-right {
  display: flex;
  align-items: center;
  gap: 18px;
}

.price {
  color: #16a34a;
  white-space: nowrap;
}

.empty-state {
  padding: 45px 20px;
  text-align: center;
  color: #64748b;
}

.empty-state > span {
  display: block;
  margin-bottom: 10px;
  font-size: 35px;
}

.empty-state h3 {
  margin: 0 0 8px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.large-empty {
  margin-top: 20px;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  background: white;
}

/* ================================ */
/* REPAIR ORDER */
/* ================================ */

.form-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 0 18px;
}

.orders-section {
  margin-top: 35px;
}

.order-grid {
  display: grid;
  grid-template-columns:
    repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 18px;
}

.order-card {
  padding: 22px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: white;
  box-shadow:
    0 3px 10px
    rgba(15, 23, 42, 0.04);
}

.order-card-header {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eef2f7;
}

.order-number {
  display: block;
  margin-bottom: 5px;
  color: #94a3b8;
  font-size: 12px;
}

.order-card h3 {
  margin: 0;
}

.status-badge {
  height: fit-content;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: bold;
  white-space: nowrap;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.progress {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-badge.completed {
  background: #dcfce7;
  color: #15803d;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 0;
}

.order-details div {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-details span {
  color: #94a3b8;
  font-size: 12px;
}

.order-details strong {
  font-size: 14px;
}

.problem-detail p {
  margin: 0;
  color: #475569;
  line-height: 1.5;
  font-size: 14px;
}

.order-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #eef2f7;
}

/* ================================ */
/* RESPONSIVE */
/* ================================ */

@media (max-width: 900px) {

  .sidebar {
    width: 210px;
  }

  .page-content,
  .top-header {
    padding-left: 25px;
    padding-right: 25px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 700px) {

  .app-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    min-height: auto;
  }

  .sidebar-brand {
    padding-bottom: 15px;
  }

  .sidebar-menu {
    flex-direction: row;
    flex-wrap: wrap;
    padding-top: 15px;
  }

  .nav-item {
    width: auto;
    flex: 1;
    min-width: 140px;
  }

  .sidebar-bottom {
    margin-top: 20px;
  }

  .top-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 15px;
  }

  .page-content {
    padding: 25px 18px;
  }

  .page-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .list-item,
  .service-right {
    align-items: flex-start;
    flex-direction: column;
  }

  .service-right {
    width: 100%;
  }

  .action-buttons {
    flex-wrap: wrap;
  }
}
</style>
