/**
 * Mock data generation utilities for Nishat Beverages.
 * All TypeScript interfaces and type annotations have been removed.
 */

const MOCK_NAMES = ["Ali Khan", "Fatima Ahmed", "Usman Butt", "Ayesha Malik", "Bilal Chaudhry", "Sana Mirza", "Hassan Jutt", "Zainab Raza"];
const MOCK_EXPENSE_CATS = ["Utilities", "Salaries", "Maintenance", "Fuel", "Marketing"];
const MOCK_EXPENSE_DESC = ["Electricity Bill", "Staff Salaries", "Van Repair", "Diesel for delivery van", "Flyer printing"];

const MOCK_INVENTORY_ITEMS = [
    { name: "19 Ltr Bottle", category: "Water Bottle", unit: "bottles", lowStock: 20, sellingPrice: 120 },
    { name: "6 Ltr Bottle", category: "Water Bottle", unit: "bottles", lowStock: 50, sellingPrice: 70 },
    { name: "1.5 Ltr Bottle (Box)", category: "Water Bottle", unit: "boxes", lowStock: 30, sellingPrice: 500 },
    { name: "500 ml Bottle (Box)", category: "Water Bottle", unit: "boxes", lowStock: 40, sellingPrice: 400 },
    { name: "Water Dispenser", category: "Appliance", unit: "units", lowStock: 5, sellingPrice: 15000 },
];

// Helper functions (Generics <T> removed)
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

export const generateSalesmen = (count) => {
    const salesmen = [];
    for (let i = 1; i <= count; i++) {
        const hireDate = new Date();
        hireDate.setDate(hireDate.getDate() - getRandomInt(30, 365 * 2));
        salesmen.push({
            id: i,
            name: `Salesman ${String.fromCharCode(64 + i)}`,
            mobile: `0300-123456${i}`,
            hireDate: hireDate.toISOString(),
            monthlySalary: getRandomInt(25000, 45000),
            customersAssigned: 0,
            quantitySoldToday: getRandomInt(20, 50)
        });
    }
    return salesmen;
};

export const generateCustomers = (count, salesmen) => {
    const customers = [];
    const MOCK_AREAS = ["Defence", "Clifton", "Gulshan-e-Iqbal", "PECHS", "North Nazimabad"];
    const MOCK_SECTORS = ["Phase 1", "Phase 2", "Phase 5", "Phase 6", "Block 8", "Block 13-D", "Block H"];

    for (let i = 1; i <= count; i++) {
        const currentSalesmanId = getRandom(salesmen).id;
        const assignmentHistory = [];

        if (Math.random() > 0.5) {
            const historicalSalesman = getRandom(salesmen);
            const historicalSalesmanId = historicalSalesman.id !== currentSalesmanId ? historicalSalesman.id : null;
            const historicalDate = new Date();
            historicalDate.setDate(historicalDate.getDate() - getRandomInt(15, 60));
            assignmentHistory.push({
                salesmanId: historicalSalesmanId,
                date: historicalDate.toISOString(),
            });
        }
        
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - getRandomInt(1, 14));
        assignmentHistory.push({
            salesmanId: currentSalesmanId,
            date: currentDate.toISOString(),
        });
        
        const lastCollectionDate = new Date();
        lastCollectionDate.setDate(lastCollectionDate.getDate() - getRandomInt(1, 15));

        const area = `${getRandom(MOCK_AREAS)} ${getRandom(MOCK_SECTORS)}`;
        customers.push({
            id: i,
            name: getRandom(MOCK_NAMES),
            address: `House #${getRandomInt(1, 100)}, Floor ${getRandomInt(0,5)}, ${getRandom(MOCK_SECTORS)}, ${getRandom(MOCK_AREAS)}`,
            mobile: `0312-987654${i % 10}`,
            area: area,
            salesmanId: currentSalesmanId,
            totalBalance: 0,
            totalBottlesPurchased: 0,
            deliveryFrequencyDays: getRandom([1, 2, 3, 7]),
            emptyBottlesHeld: 0,
            lastEmptiesCollectionDate: Math.random() > 0.2 ? lastCollectionDate.toISOString() : null,
            salesmanAssignmentHistory: assignmentHistory.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        });
    }
    return customers;
};

export const generateSales = (count, customers, salesmen, inventory) => {
    const sales = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    for (let i = 1; i <= count; i++) {
        const isCounterSale = Math.random() > 0.8;
        const itemSold = getRandom(inventory);
        const quantity = itemSold.category === 'Water Bottle' ? getRandomInt(1, 5) : 1;
        const amount = quantity * itemSold.sellingPrice;
        
        const paymentMethod = isCounterSale ? 'Cash' : getRandom(['Cash', 'Bank', 'Pending']);
        let amountReceived = 0;
        if (paymentMethod === 'Cash' || paymentMethod === 'Bank') {
            amountReceived = amount;
        } else if (Math.random() > 0.7) {
            amountReceived = Math.floor(amount / 2);
        }

        const emptiesCollected = itemSold.category === 'Water Bottle' ? (Math.random() > 0.3 ? quantity : getRandomInt(0, quantity)) : 0;
        
        sales.push({
            id: i,
            customerId: isCounterSale ? null : getRandom(customers).id,
            salesmanId: isCounterSale ? null : getRandom(salesmen).id,
            inventoryItemId: itemSold.id,
            quantity: quantity,
            emptiesCollected: emptiesCollected,
            amount,
            amountReceived,
            date: getRandomDate(startDate, endDate).toISOString(),
            paymentMethod,
        });
    }
    return sales;
};

export const generateExpenses = (count, salesmen, expenseOwners) => {
    const expenses = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    for (let i = 1; i <= count; i++) {
        let ownerId = null;
        let ownerType = null;
        
        if (Math.random() > 0.4) {
            const hasSalesmen = salesmen.length > 0;
            const hasOwners = expenseOwners.length > 0;
            if (hasSalesmen && (!hasOwners || Math.random() > 0.5)) {
                ownerType = 'salesman';
                ownerId = getRandom(salesmen).id;
            } else if (hasOwners) {
                ownerType = 'owner';
                ownerId = getRandom(expenseOwners).id;
            }
        }

        expenses.push({
            id: i,
            date: getRandomDate(startDate, endDate).toISOString(),
            category: getRandom(MOCK_EXPENSE_CATS),
            name: getRandom(MOCK_EXPENSE_DESC),
            description: Math.random() > 0.8 ? "This is an optional detailed description." : undefined,
            amount: getRandomInt(1000, 15000),
            paymentMethod: getRandom(['Cash', 'Bank']),
            ownerId,
            ownerType,
        });
    }
    return expenses;
};

export const generateInventory = () => {
    return MOCK_INVENTORY_ITEMS.map((item, index) => ({
        id: index + 1,
        name: item.name,
        category: item.category,
        stock: getRandomInt(5, 150),
        unit: item.unit,
        lowStockThreshold: item.lowStock,
        sellingPrice: item.sellingPrice,
    }));
};

export const generateSalesmanPayments = (count, salesmen) => {
    const payments = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);

    for (let i = 1; i <= count; i++) {
        const salesman = getRandom(salesmen);
        payments.push({
            id: i,
            salesmanId: salesman.id,
            date: getRandomDate(startDate, endDate).toISOString(),
            amount: getRandomInt(5000, salesman.monthlySalary / 2),
            paymentMethod: getRandom(['Cash', 'Bank']),
            notes: Math.random() > 0.7 ? 'Salary advance' : undefined,
        });
    }
    return payments;
};