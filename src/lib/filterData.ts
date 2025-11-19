import {
  salesOrders,
  invoices,
  expenses,
  customers,
  employees,
  type SalesOrder,
  type Invoice,
  type Expense,
  type Customer,
  type Employee
} from './mockData';

// Helper function to get filtered data based on time period
export const getFilteredData = (startDate: Date) => ({
  salesOrders: salesOrders.filter(order => new Date(order.date) >= startDate),
  invoices: invoices.filter(invoice => new Date(invoice.date) >= startDate),
  expenses: expenses.filter(expense => new Date(expense.date) >= startDate),
  customers: customers.filter(customer => new Date(customer.joinDate) >= startDate),
  employees: employees.filter(employee => new Date(employee.joinDate) >= startDate),
  // Add other data types as needed
});

export const getStartDate = (period: string) => {
  const now = new Date();
  const startDate = new Date();
  
  switch (period) {
    case 'day':
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate.setDate(now.getDate() - now.getDay());
      break;
    case 'month':
      startDate.setDate(1);
      break;
    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate.setMonth(quarter * 3, 1);
      break;
    case 'year':
      startDate.setMonth(0, 1);
      break;
    default:
      startDate.setDate(1); // Default to month
  }
  
  return startDate;
};