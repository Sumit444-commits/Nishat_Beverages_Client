// /**
//  * API Service for Nishat Beverages.
//  * Replaces LocalStorage with calls to the MongoDB/Express Backend.
//  */

// const API_BASE_URL = "http://localhost:5000/api"; // Adjust to your server port

// /**
//  * Generic Fetch Wrapper with error handling
//  */
// const fetchAPI = async (endpoint, options = {}) => {
//   try {
//     const response = await fetch(`${API_BASE_URL}${endpoint}`, {
//       headers: {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//       ...options,
//     });
//     const result = await response.json();
//     if (!result.success) throw new Error(result.message || "API Error");
//     return result.data || result;
//   } catch (error) {
//     console.error(`❌ API Request Failed [${endpoint}]:`, error.message);
//     throw error;
//   }
// };

// export const apiService = {
//   // ========== AUTH ==========
//   login: (credentials) =>
//     fetchAPI("/auth/login", {
//       method: "POST",
//       body: JSON.stringify(credentials),
//     }),

//   signup: (userData) =>
//     fetchAPI("/auth/signup", {
//       method: "POST",
//       body: JSON.stringify(userData),
//     }),

//   // ========== CUSTOMERS ==========
//   getCustomers: (params = {}) => {
//     const query = new URLSearchParams(params).toString();
//     return fetchAPI(`/customers?${query}`);
//   },

//   getCustomerById: (id) => fetchAPI(`/customers/${id}`),

//   addCustomer: (customerData) =>
//     fetchAPI("/customers", {
//       method: "POST",
//       body: JSON.stringify(customerData),
//     }),

//   updateCustomer: (id, updates) =>
//     fetchAPI(`/customers/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(updates),
//     }),

//   deleteCustomer: (id) => fetchAPI(`/customers/${id}`, { method: "DELETE" }),

//   // ========== SALESMEN ==========
//   getSalesmen: () => fetchAPI("/salesmen"),

//   addSalesman: (salesmanData) =>
//     fetchAPI("/salesmen", {
//       method: "POST",
//       body: JSON.stringify(salesmanData),
//     }),
//   updateSalesman: (id, updates) =>
//     fetchAPI(`/salesmen/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(updates),
//     }),

//   // ========== AREAS ==========
//   getAreaAssignments: () => fetchAPI("/area-assignments"),

//   addArea: (areaData) =>
//     fetchAPI("/area-assignments", {
//       method: "POST",
//       body: JSON.stringify(areaData),
//     }),

//   updateArea: (id, updates) =>
//     fetchAPI(`/area-assignments/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(updates),
//     }),

// deleteArea: (id) => fetchAPI(`/area-assignments/${id}`, {
//     method: 'DELETE'
// }),
//   // Add these to your apiService.js object:

//   getInventory: () => fetchAPI("/inventory"),
//   addInventoryItem: (itemData) =>
//     fetchAPI("/inventory", {
//       method: "POST",
//       body: JSON.stringify(itemData),
//     }),
//   updateInventoryItem: (id, updates) =>
//     fetchAPI(`/inventory/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(updates),
//     }),

//   getSales: () => fetchAPI("/sales"),

//   addSale: (saleData) =>
//     fetchAPI("/sales", {
//       method: "POST",
//       body: JSON.stringify(saleData),
//     }),

//   deleteSale: (id) =>
//     fetchAPI(`/sales/${id}`, {
//       method: "DELETE",
//     }),

//   updateExpense: (id, updates) =>
//     fetchAPI(`/expenses/${id}`, {
//       method: "PUT",
//       body: JSON.stringify(updates),
//     }),
//   deleteExpense: (id) =>
//     fetchAPI(`/expenses/${id}`, {
//       method: "DELETE",
//     }),
//   getExpenses: () => fetchAPI("/expenses"),
//   addExpense: (expenseData) =>
//     fetchAPI("/expenses", {
//       method: "POST",
//       body: JSON.stringify(expenseData),
//     }),
//   getExpenseOwners: () => fetchAPI("/expense-owners"),
//   addExpenseOwner: (name) =>
//     fetchAPI("/expense-owners", {
//       method: "POST",
//       body: JSON.stringify({ name }),
//     }),
//   // ========== ANALYTICS ==========
//   getCustomerStats: () => fetchAPI("/customers/stats/summary"),
//   getSalesmanStats: () => fetchAPI("/salesmen/stats/summary"),

//   getCustomersAreas: () => fetchAPI("/customers/areas/list"),
// };

/**
 * API Service for Nishat Beverages.
 * Replaces LocalStorage with calls to the MongoDB/Express Backend.
 */

const API_BASE_URL = "http://localhost:5000/api"; // Adjust to your server port

/**
 * Generic Fetch Wrapper with error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    // Check if the response is empty (e.g., 204 No Content for DELETES)
    if (response.status === 204) return true;

    const result = await response.json();
    if (!result.success) throw new Error(result.message || "API Error");
    return result.data || result;
  } catch (error) {
    console.error(`❌ API Request Failed [${endpoint}]:`, error.message);
    throw error;
  }
};

export const apiService = {
  // ========== AUTH ==========
  login: (credentials) =>
    fetchAPI("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  signup: (userData) =>
    fetchAPI("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // ========== CUSTOMERS ==========
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/customers?${query}`);
  },
  getCustomerById: (id) => fetchAPI(`/customers/${id}`),
  addCustomer: (customerData) =>
    fetchAPI("/customers", {
      method: "POST",
      body: JSON.stringify(customerData),
    }),
  updateCustomer: (id, updates) =>
    fetchAPI(`/customers/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteCustomer: (id) => fetchAPI(`/customers/${id}`, { method: "DELETE" }),
  getCustomerStats: () => fetchAPI("/customers/stats/summary"),
  getCustomersAreas: () => fetchAPI("/customers/areas/list"),

  // ========== SALESMEN ==========
  getSalesmen: () => fetchAPI("/salesmen"),
  addSalesman: (salesmanData) =>
    fetchAPI("/salesmen", {
      method: "POST",
      body: JSON.stringify(salesmanData),
    }),
  updateSalesman: (id, updates) =>
    fetchAPI(`/salesmen/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteSalesman: (id) => fetchAPI(`/salesmen/${id}`, { method: "DELETE" }),
  getSalesmanStats: () => fetchAPI("/salesmen/stats/summary"),

  // ========== SALESMAN PAYMENTS (SALARIES) ==========
  getSalesmanPayments: () => fetchAPI("/salesman-payments"),
  addSalesmanPayment: (paymentData) =>
    fetchAPI("/salesman-payments", {
      method: "POST",
      body: JSON.stringify(paymentData),
    }),

  // ========== INVENTORY & STOCK ==========
  getInventory: () => fetchAPI("/inventory"),
  addInventoryItem: (itemData) =>
    fetchAPI("/inventory", {
      method: "POST",
      body: JSON.stringify(itemData),
    }),
  updateInventoryItem: (id, updates) =>
    fetchAPI(`/inventory/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteInventoryItem: (id) =>
    fetchAPI(`/inventory/${id}`, { method: "DELETE" }),

  getStockAdjustments: () => fetchAPI("/stock-adjustments"),
  addStockAdjustment: (data) =>
    fetchAPI("/stock-adjustments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // ========== SALES & TRANSACTIONS ==========
  getSales: () => fetchAPI("/sales"),
  addSale: (saleData) =>
    fetchAPI("/sales", {
      method: "POST",
      body: JSON.stringify(saleData),
    }),
  updateSale: (id, updates) =>
    fetchAPI(`/sales/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteSale: (id) => fetchAPI(`/sales/${id}`, { method: "DELETE" }),

  // ========== EXPENSES & OWNERS ==========
  getExpenses: () => fetchAPI("/expenses"),
  addExpense: (expenseData) =>
    fetchAPI("/expenses", {
      method: "POST",
      body: JSON.stringify(expenseData),
    }),
  updateExpense: (id, updates) =>
    fetchAPI(`/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteExpense: (id) => fetchAPI(`/expenses/${id}`, { method: "DELETE" }),

  getExpenseOwners: () => fetchAPI("/expense-owners"),
  addExpenseOwner: (data) =>
    fetchAPI("/expense-owners", {
      method: "POST",
      body: JSON.stringify(data), // Passed as { name: "..." } from Dashboard
    }),

  // ========== AREA ASSIGNMENTS (ROUTES) ==========
  getAreaAssignments: () => fetchAPI("/area-assignments"),
  addAreaAssignment: (areaData) =>
    fetchAPI("/area-assignments", {
      method: "POST",
      body: JSON.stringify(areaData),
    }),
  updateAreaAssignment: (id, updates) =>
    fetchAPI(`/area-assignments/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),
  deleteAreaAssignment: (id) =>
    fetchAPI(`/area-assignments/${id}`, { method: "DELETE" }),

  // ========== DAILY ROUTE ASSIGNMENTS (BOTTLES LOG) ==========
  getDailyAssignments: () => fetchAPI("/daily-assignments"),
  addDailyAssignment: (assignmentData) =>
    fetchAPI("/daily-assignments", {
      method: "POST",
      body: JSON.stringify(assignmentData),
    }),
  updateDailyAssignment: (id, updates) =>
    fetchAPI(`/daily-assignments/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }),

  // ========== FINANCIAL LEDGERS & CLOSINGS ==========
  getDailyOpeningBalances: () => fetchAPI("/opening-balances"),
  addDailyOpeningBalance: (balanceData) =>
    fetchAPI("/opening-balances", {
      method: "POST",
      body: JSON.stringify(balanceData),
    }),

  getClosingRecords: () => fetchAPI("/closing-records"),
  addClosingRecord: (recordData) =>
    fetchAPI("/closing-records", {
      method: "POST",
      body: JSON.stringify(recordData),
    }),

  // ========== WHATSAPP REMINDERS LOG ==========
  getDailyReminders: () => fetchAPI("/daily-reminders"),
  addDailyReminder: (reminderData) =>
    fetchAPI("/daily-reminders", {
      method: "POST",
      body: JSON.stringify(reminderData),
    }),
};
