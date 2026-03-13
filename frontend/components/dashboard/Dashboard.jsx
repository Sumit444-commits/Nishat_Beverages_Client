import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import StatCard from './StatCard';
import CustomerAccounts from '../customer/CustomerAccounts';
import CustomerFilters from './CustomerFilters';
import AddCustomerModal from '../customer/AddCustomerModal';
import EditCustomerModal from '../customer/EditCustomerModal';
import AddSaleModal from '../customer/AddSaleModal';
import EditSaleModal from '../sales/EditSaleModal';
import CustomerDetail from './CustomerDetail';
import Reports from './Reports';
import Expenses from './Expenses';
import AddExpenseModal from '../expenses/AddExpenseModal';
import EditExpenseModal from '../expenses/EditExpenseModal';
import Salesmen from './Salesmen';
import AddSalesmanModal from '../salesmen/AddSalesmanModal';
import EditSalesmanModal from '../salesmen/EditSalesmanModal';
import SalesmanDetail from './SalesmanDetail';
import DailySales from './DailySales';
import Inventory from './Inventory';
import AddInventoryItemModal from '../inventory/AddInventoryItemModal';
import EditInventoryItemModal from '../inventory/EditInventoryItemModal';
import UpdateStockModal from '../inventory/UpdateStockModal';
import InventoryDetail from './InventoryDetail';
import ClosingReport from './ClosingReport';
import DailyBottlesAssigned from './DailyBottlesAssigned';
import Outstanding from './Outstanding';
import DeliverySchedule from './DeliverySchedule';
import DailyReminders from './DailyReminders';
import CashRecon from './CashRecon';
import ConfirmationModal from '../common/ConfirmationModal';
import MarkAsPaidModal from '../customer/MarkAsPaidModal';
import RecordPaymentModal from '../customer/RecordPaymentModal';
import CollectEmptiesModal from '../customer/CollectEmptiesModal';
import RecordOpeningBalanceModal from './RecordOpeningBalanceModal';
import SalesmanDailyReport from '../salesman/SalesmanDailyReport';
import ConfirmClosingModal from './ConfirmClosingModal';
import SalesmanPayments from '../salesman/SalesmanPayments';
import AddSalesmanPaymentModal from '../salesman/AddSalesmanPaymentModal';
import AreaAssignment from './AreaAssignment';
import AccountManagement from './AccountManagement';
import { apiService } from '../../api/apiService'; // NEW: Centralized API calls
import { isDeliveryDue } from '../../utils/delivery-helper';
import { inferPaymentCategoryFromInventory, is19LItemName, is6LItemName } from '../../utils/payment-category';
import { getLocalDateString, getTodayLocalDateString } from '../../utils/date';
import { BriefcaseIcon, PackageIcon, UsersIcon, DollarSignIcon, TrendingUpIcon, PlusCircleIcon } from "../icons/index";
import toast from 'react-hot-toast';

const Dashboard = ({ user, onLogout }) => {
    // Initialize empty state structure
    const [db, setDb] = useState({
        customers: [], sales: [], expenses: [], salesmen: [], inventory: [],
        dailyOpeningBalances: [], closingRecords: [], dailyAssignments: [],
        salesmanPayments: [], areaAssignments: [], expenseOwners: [],
        stockAdjustments: [], dailyReminders: []
    });
    
    const [isInitializing, setIsInitializing] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [activeView, setActiveView] = useState('Dashboard');
    
    // State for modals
    const [isAddCustomerOpen, setAddCustomerOpen] = useState(false);
    const [isEditCustomerOpen, setEditCustomerOpen] = useState(false);
    const [isAddSaleOpen, setAddSaleOpen] = useState(false);
    const [isEditSaleOpen, setEditSaleOpen] = useState(false);
    const [isAddExpenseOpen, setAddExpenseOpen] = useState(false);
    const [isEditExpenseOpen, setEditExpenseOpen] = useState(false);
    const [isAddSalesmanOpen, setAddSalesmanOpen] = useState(false);
    const [isEditSalesmanOpen, setEditSalesmanOpen] = useState(false);
    const [isAddInventoryOpen, setAddInventoryOpen] = useState(false);
    const [isEditInventoryOpen, setEditInventoryOpen] = useState(false);
    const [isUpdateStockOpen, setUpdateStockOpen] = useState(false);
    const [isConfirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [isMarkAsPaidOpen, setMarkAsPaidOpen] = useState(false);
    const [isRecordPaymentOpen, setRecordPaymentOpen] = useState(false);
    const [isCollectEmptiesOpen, setCollectEmptiesOpen] = useState(false);
    const [isRecordOpeningBalanceOpen, setRecordOpeningBalanceOpen] = useState(false);
    const [isConfirmClosingOpen, setConfirmClosingOpen] = useState(false);
    const [isAddSalesmanPaymentOpen, setAddSalesmanPaymentOpen] = useState(false);
    
    // State for selected items
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedSale, setSelectedSale] = useState(null);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [selectedSalesman, setSelectedSalesman] = useState(null);
    const [selectedInventoryItem, setSelectedInventoryItem] = useState(null);
    const [preselectedItemId, setPreselectedItemId] = useState(undefined);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [closingPeriodData, setClosingPeriodData] = useState(null);
    const [preselectedAccountId, setPreselectedAccountId] = useState(null);
    
    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dueFilter, setDueFilter] = useState(false);
    const [financialDate, setFinancialDate] = useState(getTodayLocalDateString());

    // --- Master Data Fetcher ---
    const fetchAllData = async () => {
        try {
            // Using Promise.all to fetch everything simultaneously. 
            // Fallbacks added to prevent total app crash if an endpoint isn't built yet.
            const [
                customers, sales, expenses, salesmen, inventory,
                dailyOpeningBalances, closingRecords, dailyAssignments,
                salesmanPayments, areaAssignments, expenseOwners,
                stockAdjustments, dailyReminders
            ] = await Promise.all([
                apiService.getCustomers().catch(() => []),
                apiService.getSales().catch(() => []),
                apiService.getExpenses().catch(() => []),
                apiService.getSalesmen().catch(() => []),
                apiService.getInventory().catch(() => []),
                apiService.getDailyOpeningBalances().catch(() => []),
                apiService.getClosingRecords().catch(() => []),
                apiService.getDailyAssignments().catch(() => []),
                apiService.getSalesmanPayments().catch(() => []),
                apiService.getAreaAssignments().catch(() => []),
                apiService.getExpenseOwners().catch(() => []),
                apiService.getStockAdjustments().catch(() => []),
                apiService.getDailyReminders().catch(() => [])
            ]);

            setDb({
                customers, sales, expenses, salesmen, inventory,
                dailyOpeningBalances, closingRecords, dailyAssignments,
                salesmanPayments, areaAssignments, expenseOwners,
                stockAdjustments, dailyReminders
            });
        } catch (error) {
            console.error("Critical error fetching dashboard data:", error);
            toast.error("Failed to connect to the database.");
        } finally {
            setIsInitializing(false);
            setIsSyncing(false);
        }
    };

    // Initial Load
    useEffect(() => {
        fetchAllData();
    }, []);

    const notifications = useMemo(() => {
        const alerts = [];
        const lowStockItems = db.inventory.filter(item => item.stock < item.lowStockThreshold);
        
        lowStockItems.forEach((item, index) => {
            alerts.push({
                id: `stock-${item._id || index}`,
                title: 'Low Stock Alert',
                description: `${item.name} stock is low (${item.stock} remaining). Please reorder.`,
                date: new Date().toISOString(),
                read: false,
            });
        });

        const recentSales = [...db.sales]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 3);

        recentSales.forEach((sale, index) => {
            const customerId = String(sale.customerId?._id || sale.customerId);
            const customerName = customerId ? db.customers.find(c => String(c._id || c.id) === customerId)?.name : 'Counter';
            alerts.push({
                id: `sale-${sale._id || index}`,
                title: 'New Sale Recorded',
                description: `A new sale of PKR ${sale.amount} was recorded for ${customerName}.`,
                date: sale.date,
                read: index > 0, 
            });
        });

        return alerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [db.inventory, db.sales, db.customers]);

    // Derived data and filtering
    const filteredCustomers = useMemo(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();

        return db.customers.filter(customer => {
            const matchesSearch = lowerCaseSearchTerm === '' ? true :
                (customer.name || '').toLowerCase().includes(lowerCaseSearchTerm) ||
                (customer.mobile || '').includes(searchTerm) ||
                (customer.address || '').toLowerCase().includes(lowerCaseSearchTerm);
            
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'pending' && (Number(customer.totalBalance) || 0) > 0) ||
                (statusFilter === 'paid' && (Number(customer.totalBalance) || 0) <= 0);

            const matchesDue = !dueFilter || isDeliveryDue(customer, db.sales);
            
            return matchesSearch && matchesStatus && matchesDue;
        });
    }, [db.customers, db.sales, searchTerm, statusFilter, dueFilter]);

    const financialSummary = useMemo(() => {
        const openingBalanceRecord = (db.dailyOpeningBalances || []).find(b => b.date === financialDate);
        const openingBalance = openingBalanceRecord ? ((Number(openingBalanceRecord.cash)||0) + (Number(openingBalanceRecord.bank)||0)) : 0;

        const todaySales = db.sales.filter(s => s.date && getLocalDateString(s.date) === financialDate);
        const todayPayments = db.sales.filter(s => s.date && getLocalDateString(s.date) === financialDate);

        const todaySalesmanPayments = (db.salesmanPayments || []).filter(p => p.date && getLocalDateString(p.date) === financialDate);
        const totalSalesmanPaymentsToday = todaySalesmanPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

        const collection19L = todayPayments
            .filter(s => {
                const sId = String(s.inventoryItemId?._id || s.inventoryItemId);
                const item = sId ? db.inventory.find(i => String(i._id || i.id) === sId) : null;
                return (item && is19LItemName(item.name)) || s.paymentForCategory === '19Ltr Collection';
            })
            .reduce((sum, s) => sum + (Number(s.amountReceived) || 0), 0);
        
        const collection6L = todayPayments
            .filter(s => {
                 const sId = String(s.inventoryItemId?._id || s.inventoryItemId);
                const item = sId ? db.inventory.find(i => String(i._id || i.id) === sId) : null;
                return (item && is6LItemName(item.name)) || s.paymentForCategory === '6Ltr Collection';
            })
            .reduce((sum, s) => sum + (Number(s.amountReceived) || 0), 0);

        const counterSale = todaySales
            .filter(s => !s.customerId)
            .reduce((sum, s) => sum + (Number(s.amountReceived) || 0), 0);

        const totalRevenueToday = todayPayments.reduce((sum, s) => sum + (Number(s.amountReceived) || 0), 0) - totalSalesmanPaymentsToday;
        const grandTotal = openingBalance + totalRevenueToday;

        return {
            openingBalance, collection19L, collection6L, counterSale, totalRevenueToday, grandTotal
        };
    }, [db.sales, db.inventory, financialDate, db.dailyOpeningBalances, db.salesmanPayments]);

    // --- API Handlers ---
    const handleNavigate = (view) => setActiveView(view);

    const handleAddCustomer = async (customerData) => {
        setIsSyncing(true);
        try {
            // Auto-assign salesman from area if not assigned
            let finalSalesmanId = customerData.salesmanId;
            if (!finalSalesmanId && customerData.area) {
                const areaAssignment = (db.areaAssignments || []).find(a => a.area === customerData.area.trim());
                if (areaAssignment && areaAssignment.salesmanId) {
                    finalSalesmanId = String(typeof areaAssignment.salesmanId === 'object' ? areaAssignment.salesmanId._id : areaAssignment.salesmanId);
                }
            }

            const payload = { ...customerData, salesmanId: finalSalesmanId };
            const newCustomer = await apiService.addCustomer(payload);
            
            // If they have an initial balance, log it as an opening ledger sale
            if (Number(newCustomer.totalBalance) > 0) {
                 await apiService.addSale({
                    customerId: newCustomer._id,
                    amount: newCustomer.totalBalance,
                    amountReceived: 0,
                    date: new Date().toISOString(),
                    paymentMethod: 'Pending',
                    description: 'Outstanding Carried Forward Balance'
                });
            }
            
            toast.success("Customer profile created.");
            await fetchAllData();
        } catch (error) {
            toast.error(error.message || "Failed to create customer.");
        }
    };
    
    const handleUpdateCustomer = async (updatedCustomer) => {
        setIsSyncing(true);
        try {
            const id = updatedCustomer._id || updatedCustomer.id;
            await apiService.updateCustomer(id, updatedCustomer);
            toast.success("Customer profile updated.");
            
            // Update local state if it's the currently viewed customer
            if (selectedCustomer && (selectedCustomer._id || selectedCustomer.id) === id) {
                setSelectedCustomer({ ...selectedCustomer, ...updatedCustomer });
            }
            
            await fetchAllData();
        } catch (error) {
            toast.error(error.message || "Update failed.");
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsSyncing(true);
        const { type, id } = itemToDelete;
        
        try {
            switch (type) {
                case 'customer': await apiService.deleteCustomer(id); break;
                case 'salesman': await apiService.deleteSalesman(id); break;
                case 'sale': await apiService.deleteSale(id); break;
                case 'inventory': await apiService.deleteInventoryItem(id); break;
                default: break;
            }
            toast.success(`${type} deleted successfully.`);
            await fetchAllData();
        } catch (error) {
            toast.error(`Failed to delete ${type}.`);
        } finally {
            setConfirmDeleteOpen(false);
            setItemToDelete(null);
        }
    };

    const openDeleteConfirmation = (type, id) => {
        setItemToDelete({ type, id });
        setConfirmDeleteOpen(true);
    };

    // Note: Add Sale affects Customer Balances, Empties, and Inventory Stocks.
    // The backend should process these deductions, so we just send the payload and re-fetch.
    const handleAddSale = async (saleData) => {
        setIsSyncing(true);
        try {
            const inferredCategory = inferPaymentCategoryFromInventory(
                db.inventory,
                saleData.inventoryItemId,
                saleData.amountReceived,
                saleData.paymentForCategory
            );

            const payload = { ...saleData, paymentForCategory: inferredCategory };
            await apiService.addSale(payload);
            toast.success("Sale logged successfully.");
            
            await fetchAllData();
            
            // Re-select customer to refresh detail view data
            if (selectedCustomer) {
                const refreshedCustomer = db.customers.find(c => String(c._id) === String(selectedCustomer._id));
                if(refreshedCustomer) setSelectedCustomer(refreshedCustomer);
            }
        } catch (error) {
            toast.error(error.message || "Failed to log sale.");
        }
    };
    
    const handleUpdateSale = async (updatedSale) => {
        setIsSyncing(true);
        try {
            const id = updatedSale._id || updatedSale.id;
            await apiService.updateSale(id, updatedSale);
            toast.success("Transaction updated.");
            await fetchAllData();
            
            if (selectedCustomer) {
                const refreshedCustomer = db.customers.find(c => String(c._id) === String(selectedCustomer._id));
                if(refreshedCustomer) setSelectedCustomer(refreshedCustomer);
            }
        } catch (error) {
            toast.error("Failed to update transaction.");
        }
    };

    const handleMarkAsPaid = async (paymentMethod) => {
        if (!selectedCustomer) return;
        setIsSyncing(true);
        try {
            const paymentAmount = selectedCustomer.totalBalance;
            await apiService.addSale({
                customerId: selectedCustomer._id || selectedCustomer.id,
                amount: 0,
                amountReceived: paymentAmount,
                date: new Date().toISOString(),
                paymentMethod: paymentMethod,
                description: 'Outstanding Balance Cleared',
            });
            toast.success("Balance cleared!");
            await fetchAllData();
            setMarkAsPaidOpen(false);
        } catch (error) {
            toast.error("Failed to process clearance.");
        }
    };

    const handleRecordPayment = async (customerId, paymentAmount, paymentMethod, date) => {
        setIsSyncing(true);
        try {
             await apiService.addSale({
                customerId: customerId,
                amount: 0,
                amountReceived: paymentAmount,
                date: new Date(date).toISOString(),
                paymentMethod: paymentMethod,
                description: 'Payment Received',
            });
            toast.success("Payment recorded.");
            await fetchAllData();
            setRecordPaymentOpen(false);
        } catch (error) {
            toast.error("Failed to record payment.");
        }
    };

    const handleCollectEmpties = async (customerId, bottlesCollected) => {
        setIsSyncing(true);
        try {
            // Find current customer to calculate new total
            const customer = db.customers.find(c => String(c._id || c.id) === String(customerId));
            if(!customer) throw new Error("Customer not found");
            
            const newEmpties = Math.max((Number(customer.emptyBottlesHeld) || 0) - Number(bottlesCollected), 0);
            
            await apiService.updateCustomer(customerId, {
                emptyBottlesHeld: newEmpties,
                lastEmptiesCollectionDate: new Date().toISOString()
            });
            
            toast.success("Empties collected.");
            await fetchAllData();
            
            if (selectedCustomer && String(selectedCustomer._id || selectedCustomer.id) === String(customerId)) {
                setSelectedCustomer({ ...selectedCustomer, emptyBottlesHeld: newEmpties });
            }
            setCollectEmptiesOpen(false);
        } catch (error) {
            toast.error("Failed to log empties.");
        }
    };

    const handleAddExpense = async (expenseData) => {
        setIsSyncing(true);
        try {
            await apiService.addExpense(expenseData);
            toast.success("Expense added.");
            await fetchAllData();
        } catch (e) { toast.error("Failed to add expense."); }
    };
    
    const handleAddExpenseForAccount = (ownerId, ownerType) => {
        setPreselectedAccountId({ id: ownerId, type: ownerType });
        setAddExpenseOpen(true);
    };
    
    const handleAddExpenseOwner = async (name) => {
        try {
            const newOwner = await apiService.addExpenseOwner({ name });
            setDb(prev => ({...prev, expenseOwners: [...prev.expenseOwners, newOwner]}));
            return newOwner;
        } catch (error) {
            toast.error("Failed to create expense account.");
            throw error;
        }
    };
    
    const handleUpdateExpense = async (updatedExpense) => {
        setIsSyncing(true);
        try {
            await apiService.updateExpense(updatedExpense._id || updatedExpense.id, updatedExpense);
            toast.success("Expense updated.");
            await fetchAllData();
            setEditExpenseOpen(false);
        } catch (e) { toast.error("Failed to update expense."); }
    };

    const handleAddSalesman = async (salesmanData) => {
        setIsSyncing(true);
        try {
            await apiService.addSalesman(salesmanData);
            toast.success("Salesman registered.");
            await fetchAllData();
        } catch (e) { toast.error("Failed to add salesman."); }
    };

    const handleUpdateSalesman = async (updatedSalesman) => {
        setIsSyncing(true);
        try {
            await apiService.updateSalesman(updatedSalesman._id || updatedSalesman.id, updatedSalesman);
            toast.success("Profile updated.");
            await fetchAllData();
            setEditSalesmanOpen(false);
        } catch (e) { toast.error("Update failed."); }
    };

    const handleAddInventoryItem = async (itemData) => {
        setIsSyncing(true);
        try {
            await apiService.addInventoryItem(itemData);
            toast.success("Product added to catalog.");
            await fetchAllData();
        } catch (e) { toast.error("Failed to add item."); }
    };

    const handleUpdateInventoryItem = async (updatedItem) => {
        setIsSyncing(true);
        try {
            await apiService.updateInventoryItem(updatedItem._id || updatedItem.id, updatedItem);
            toast.success("Product updated.");
            await fetchAllData();
            setEditInventoryOpen(false);
        } catch (e) { toast.error("Update failed."); }
    };
    
    const handleUpdateStock = async (itemId, adjustment, reason) => {
        setIsSyncing(true);
        try {
            const item = db.inventory.find(i => String(i._id || i.id) === String(itemId));
            const newStockLevel = Number(item.stock) + Number(adjustment);
            
            // 1. Update item stock
            await apiService.updateInventoryItem(itemId, { stock: newStockLevel });
            
            // 2. Log adjustment (Assuming your API has an endpoint for this, if not, skip)
            try {
                await apiService.addStockAdjustment({
                    inventoryItemId: itemId,
                    quantity: adjustment,
                    reason,
                    newStockLevel
                });
            } catch (e) { /* silent fail if endpoint doesn't exist yet */ }
            
            toast.success("Stock levels updated.");
            await fetchAllData();
            setUpdateStockOpen(false);
        } catch (e) {
            toast.error("Failed to adjust stock.");
        }
    };

    const handleInitiateSaleFromInventory = (item) => {
        setSelectedCustomer(null);
        setPreselectedItemId(item._id || item.id);
        setAddSaleOpen(true);
    };

    const handleAddDailyAssignment = async (assignmentData) => {
        setIsSyncing(true);
        try {
            await apiService.addDailyAssignment(assignmentData);
            toast.success("Route load dispatched.");
            await fetchAllData();
        } catch (e) { toast.error("Failed to log dispatch."); }
    };

    const handleUpdateDailyAssignment = async (updatedAssignment) => {
        setIsSyncing(true);
        try {
            await apiService.updateDailyAssignment(updatedAssignment._id || updatedAssignment.id, updatedAssignment);
            toast.success("Return logged.");
            await fetchAllData();
        } catch (e) { toast.error("Failed to log return."); }
    };

    const handleSaveOpeningBalance = async (date, cash, bank) => {
        setIsSyncing(true);
        try {
            // Ideally, there is a dedicated endpoint for this. We will post it.
            await apiService.addDailyOpeningBalance({ date, cash, bank });
            toast.success("Opening balance secured.");
            await fetchAllData();
            setRecordOpeningBalanceOpen(false);
        } catch (e) { toast.error("Failed to save balance."); }
    };

    const handleSendReminder = async (summary) => {
        // Construct the message logic...
        const message = `Dear ${summary.customerName}, today's total is PKR ${summary.totalSaleAmount}. Paid: ${summary.paidAmount}. Balance: ${summary.closingBalance}. Thank you!`;
        setIsSyncing(true);
        try {
            await apiService.addDailyReminder({
                customerId: summary.customerId,
                message: message,
            });
            toast.success("Reminder logged.");
            await fetchAllData();
        } catch (e) { toast.error("Failed to log reminder."); }
    };

    const handleSendCustomerSummary = async () => {
        if (!selectedCustomer) return;
        setIsSyncing(true);
        try {
            const message = `Account summary for ${selectedCustomer.name}. Outstanding Balance: PKR ${selectedCustomer.totalBalance}. Empties Held: ${selectedCustomer.emptyBottlesHeld}.`;
             await apiService.addDailyReminder({
                customerId: selectedCustomer._id || selectedCustomer.id,
                message: message,
            });
            toast.success("Summary logged.");
            await fetchAllData();
        } catch (e) { toast.error("Failed to generate summary."); }
    };

    const handleInitiateClose = (periodData) => {
        setClosingPeriodData(periodData);
        setConfirmClosingOpen(true);
    };

    const handleConfirmClose = async () => {
        if (!closingPeriodData) return;
        setIsSyncing(true);
        try {
             await apiService.addClosingRecord({
                period: closingPeriodData.period,
                periodName: closingPeriodData.periodName,
                cashRevenue: closingPeriodData.cashRevenue,
                bankRevenue: closingPeriodData.bankRevenue,
                cashExpenses: closingPeriodData.cashExpenses,
                bankExpenses: closingPeriodData.bankExpenses,
                netBalance: closingPeriodData.netBalance,
             });
             toast.success("Period successfully closed.");
             await fetchAllData();
             setConfirmClosingOpen(false);
             setClosingPeriodData(null);
        } catch (e) { toast.error("Failed to close period."); }
    };

    const handleAddSalesmanPayment = async (paymentData) => {
        setIsSyncing(true);
        try {
             await apiService.addSalesmanPayment(paymentData);
             toast.success("Salary payment recorded.");
             await fetchAllData();
        } catch (e) { toast.error("Failed to log payment."); }
    };

    const handleAddArea = async (areaName) => {
        setIsSyncing(true);
        try {
            await apiService.addAreaAssignment({ area: areaName });
            toast.success("Route area created.");
            await fetchAllData();
        } catch (e) { toast.error("Failed to create area."); }
    };

    const handleUpdateArea = async (id, areaName, salesmanId) => {
        setIsSyncing(true);
        try {
            await apiService.updateAreaAssignment(id, { area: areaName, salesmanId });
            toast.success("Route assignment updated.");
            await fetchAllData();
        } catch (e) { toast.error("Failed to update route."); }
    };

    const handleDeleteArea = async (id) => {
        setIsSyncing(true);
        try {
             await apiService.deleteAreaAssignment(id);
             toast.success("Route deleted.");
             await fetchAllData();
        } catch (e) { toast.error("Failed to delete route."); }
    };

    const allAreas = useMemo(() => {
        return (db.areaAssignments || []).map(a => a.area);
    }, [db.areaAssignments]);

    

    const renderContent = () => {
        if (isInitializing) {
            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-blue mb-4"></div>
                    <p className="text-brand-text-secondary font-medium tracking-widest uppercase">Connecting to Database...</p>
                </div>
            );
        }

        switch (activeView) {
            case 'Dashboard':
                const todayDeliveries = db.customers.filter(c => isDeliveryDue(c, db.sales));
                const recentSales = [...db.sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
                return (
                    <div className="animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
                            <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Plant Dashboard</h1>
                            <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-block">
                                <input
                                    type="date"
                                    value={financialDate}
                                    onChange={e => setFinancialDate(e.target.value)}
                                    className="px-4 py-2 bg-transparent focus:outline-none focus:ring-0 text-brand-blue font-bold cursor-pointer"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <StatCard title="Opening Balance" value={`PKR ${financialSummary.openingBalance.toLocaleString()}`} icon={<BriefcaseIcon />} color="text-indigo-500" onClick={() => setRecordOpeningBalanceOpen(true)} />
                            <StatCard title="19Ltr Collection" value={`PKR ${financialSummary.collection19L.toLocaleString()}`} icon={<PackageIcon />} color="text-brand-blue" />
                            <StatCard title="6Ltr Collection" value={`PKR ${financialSummary.collection6L.toLocaleString()}`} icon={<PackageIcon />} color="text-brand-accent" />
                            <StatCard title="Counter Sale" value={`PKR ${financialSummary.counterSale.toLocaleString()}`} icon={<UsersIcon />} color="text-teal-500" />
                            <StatCard title="Total Revenue (Today)" value={`PKR ${financialSummary.totalRevenueToday.toLocaleString()}`} icon={<DollarSignIcon />} color="text-green-500" />
                            <StatCard title="Day's Est. Closing" value={`PKR ${financialSummary.grandTotal.toLocaleString()}`} icon={<TrendingUpIcon />} color="text-purple-500" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-[400px]">
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h2 className="text-lg font-black text-brand-text-primary">Today's Deliveries</h2>
                                    <span className="text-xs font-bold bg-blue-100 text-brand-blue px-2.5 py-1 rounded-full">{todayDeliveries.length} Routes</span>
                                </div>
                                <div className="p-2 space-y-1 overflow-y-auto flex-grow">
                                    {todayDeliveries.length > 0 ? todayDeliveries.map(c => (
                                        <div key={c._id || c.id} className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                                            <div className="min-w-0 pr-4">
                                                <p className="font-bold text-brand-text-primary truncate">{c.name}</p>
                                                <p className="text-xs text-brand-text-secondary truncate mt-0.5">{c.address}</p>
                                            </div>
                                            <button onClick={() => { setSelectedCustomer(c); setActiveView('CustomerDetail'); }} className="text-xs font-bold text-brand-blue bg-blue-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                Profile &rarr;
                                            </button>
                                        </div>
                                    )) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                            <PackageIcon className="h-8 w-8 mb-2 opacity-50" />
                                            <p className="font-medium">No deliveries scheduled.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col h-[400px]">
                                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                                    <h2 className="text-lg font-black text-brand-text-primary">Live Transactions</h2>
                                </div>
                                <div className="overflow-y-auto flex-grow p-0">
                                    {recentSales.length > 0 ? (
                                        <table className="w-full text-sm text-left">
                                            <tbody className="divide-y divide-gray-100">
                                                {recentSales.map(s => {
                                                    const customerName = s.customerId ? db.customers.find(c => String(c._id || c.id) === String(typeof s.customerId === 'object' ? s.customerId._id : s.customerId))?.name : 'Counter Sale';
                                                    const itemName = s.inventoryItemId ? db.inventory.find(i => String(i._id || i.id) === String(typeof s.inventoryItemId === 'object' ? s.inventoryItemId._id : s.inventoryItemId))?.name : s.description;
                                                    
                                                    return (
                                                        <tr key={s._id || s.id} className="hover:bg-green-50/30 transition-colors">
                                                            <td className="px-5 py-4 font-bold text-brand-text-primary truncate max-w-[120px]">{customerName}</td>
                                                            <td className="px-5 py-4 text-xs font-medium text-gray-500 truncate max-w-[100px]">{itemName} {s.quantity > 0 ? `(x${s.quantity})` : ''}</td>
                                                            <td className="px-5 py-4 text-right font-black text-green-600">PKR {Number(s.amount || 0).toLocaleString()}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                         <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                                            <DollarSignIcon className="h-8 w-8 mb-2 opacity-50" />
                                            <p className="font-medium">No recent sales activity.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 'Customers':
                return (
                    <div className="animate-fade-in">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">
                                Customer Accounts <span className="text-lg text-brand-text-secondary font-medium ml-2">({filteredCustomers.length})</span>
                            </h1>
                            <button onClick={() => setAddCustomerOpen(true)} className="flex items-center justify-center bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold shadow-md hover:bg-brand-lightblue active:scale-95 transition-all w-full md:w-auto">
                                <PlusCircleIcon className="h-5 w-5 mr-2" />
                                Add Customer
                            </button>
                        </div>
                        <CustomerFilters
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            statusFilter={statusFilter}
                            onStatusFilterChange={setStatusFilter}
                            dueFilter={dueFilter}
                            onDueFilterChange={setDueFilter}
                        />
                        <CustomerAccounts
                            customers={filteredCustomers}
                            sales={db.sales}
                            onAddSale={(customer) => { setSelectedCustomer(customer); setAddSaleOpen(true); }}
                            onCollectEmpties={(customer) => { setSelectedCustomer(customer); setCollectEmptiesOpen(true); }}
                            onViewDetails={customer => { setSelectedCustomer(customer); setActiveView('CustomerDetail'); }}
                            onEditCustomer={customer => { setSelectedCustomer(customer); setEditCustomerOpen(true); }}
                            onDeleteCustomer={(id) => openDeleteConfirmation('customer', id)}
                        />
                    </div>
                );
            case 'CustomerDetail':
                if (!selectedCustomer) return <div>No customer selected.</div>;
                return <CustomerDetail
                    customer={selectedCustomer}
                    sales={db.sales.filter(s => {
                        const sId = String(s.customerId?._id || s.customerId);
                        const cId = String(selectedCustomer._id || selectedCustomer.id);
                        return sId === cId;
                    })}
                    reminders={db.dailyReminders.filter(r => String(r.customerId) === String(selectedCustomer._id || selectedCustomer.id))}
                    inventory={db.inventory}
                    salesmen={db.salesmen}
                    onBack={() => setActiveView('Customers')}
                    onEditCustomer={() => { setSelectedCustomer(selectedCustomer); setEditCustomerOpen(true); }}
                    onAddSale={() => { setSelectedCustomer(selectedCustomer); setAddSaleOpen(true); }}
                    onUpdateSale={handleUpdateSale}
                    onCollectEmpties={() => { setSelectedCustomer(selectedCustomer); setCollectEmptiesOpen(true); }}
                    onClearBalance={() => { setSelectedCustomer(selectedCustomer); setMarkAsPaidOpen(true); }}
                    onRecordPayment={() => { setSelectedCustomer(selectedCustomer); setRecordPaymentOpen(true); }}
                    onSendSummary={handleSendCustomerSummary}
                />;
            case 'Salesmen':
                return <Salesmen
                    salesmen={db.salesmen}
                    onAddSalesman={() => setAddSalesmanOpen(true)}
                    onViewDetails={salesman => { setSelectedSalesman(salesman); setActiveView('SalesmanDetail'); }}
                    onEditSalesman={salesman => { setSelectedSalesman(salesman); setEditSalesmanOpen(true); }}
                    onDeleteSalesman={(id) => openDeleteConfirmation('salesman', id)}
                />;
            case 'SalesmanDetail':
                if (!selectedSalesman) return <div>No salesman selected.</div>;
                return <SalesmanDetail
                    salesman={selectedSalesman}
                    customers={db.customers}
                    sales={db.sales}
                    salesmanPayments={db.salesmanPayments || []}
                    areaAssignments={db.areaAssignments || []}
                    onBack={() => setActiveView('Salesmen')}
                    onViewCustomerDetails={customer => { setSelectedCustomer(customer); setActiveView('CustomerDetail'); }}
                    onViewReport={() => setActiveView('SalesmanReport')}
                    onAddPayment={() => setAddSalesmanPaymentOpen(true)}
                />;
            case 'Area Assignment':
                return <AreaAssignment
                    areaAssignments={db.areaAssignments || []}
                    salesmen={db.salesmen}
                    customers={db.customers}
                    onAddArea={handleAddArea}
                    onUpdateArea={handleUpdateArea}
                    onDeleteArea={handleDeleteArea}
                    onNavigateToSalesman={(salesmanId) => {
                        const targetId = String(salesmanId);
                        const salesman = db.salesmen.find(s => String(s._id || s.id) === targetId);
                        if (salesman) {
                            setSelectedSalesman(salesman);
                            setActiveView('SalesmanDetail');
                        }
                    }}
                />;
            case 'SalesmanReport':
                if (!selectedSalesman) return <div>No salesman selected for report.</div>;
                return <SalesmanDailyReport
                    salesman={selectedSalesman}
                    customers={db.customers}
                    sales={db.sales}
                    onBack={() => setActiveView('SalesmanDetail')}
                />;
            case 'Daily Sales':
                return <DailySales
                    sales={db.sales}
                    customers={db.customers}
                    salesmen={db.salesmen}
                    inventory={db.inventory}
                    onEditSale={sale => { setSelectedSale(sale); setEditSaleOpen(true); }}
                    onDeleteSale={(id) => openDeleteConfirmation('sale', id)}
                />;
            case 'Daily Reminders':
                return <DailyReminders
                    customers={db.customers}
                    sales={db.sales}
                    onSendReminder={handleSendReminder}
                />;
            case 'Expenses':
                return <Expenses
                    expenses={db.expenses}
                    salesmen={db.salesmen}
                    expenseOwners={db.expenseOwners || []}
                    onAddExpense={() => setAddExpenseOpen(true)}
                    onEditExpense={expense => { setSelectedExpense(expense); setEditExpenseOpen(true); }}
                />;
            case 'Account Management':
                return <AccountManagement
                    expenses={db.expenses}
                    salesmen={db.salesmen}
                    expenseOwners={db.expenseOwners || []}
                    onAddExpense={handleAddExpenseForAccount}
                    onEditExpense={expense => { setSelectedExpense(expense); setEditExpenseOpen(true); }}
                    onAddOwner={handleAddExpenseOwner}
                />;
            case 'Salesman Payments':
                return <SalesmanPayments
                    payments={db.salesmanPayments || []}
                    salesmen={db.salesmen}
                    onAddPayment={() => setAddSalesmanPaymentOpen(true)}
                />;
            case 'Inventory':
                return <Inventory
                    inventory={db.inventory}
                    onAddItem={() => setAddInventoryOpen(true)}
                    onEditItem={(item) => { setSelectedInventoryItem(item); setEditInventoryOpen(true); }}
                    onUpdateStock={(item) => { setSelectedInventoryItem(item); setUpdateStockOpen(true); }}
                    onSellItem={handleInitiateSaleFromInventory}
                    onDeleteItem={(id) => openDeleteConfirmation('inventory', id)}
                    onViewDetails={(item) => { setSelectedInventoryItem(item); setActiveView('InventoryDetail'); }}
                />;
            case 'InventoryDetail':
                if (!selectedInventoryItem) return <div>No item selected.</div>;
                return <InventoryDetail
                    item={selectedInventoryItem}
                    sales={db.sales.filter(s => {
                        const sId = String(s.inventoryItemId?._id || s.inventoryItemId);
                        const iId = String(selectedInventoryItem._id || selectedInventoryItem.id);
                        return sId === iId;
                    })}
                    customers={db.customers}
                    adjustments={db.stockAdjustments.filter(a => {
                        const aId = String(a.inventoryItemId?._id || a.inventoryItemId);
                        const iId = String(selectedInventoryItem._id || selectedInventoryItem.id);
                        return aId === iId;
                    })}
                    onBack={() => setActiveView('Inventory')}
                />;
            case 'Business Reports':
                return <Reports sales={db.sales} expenses={db.expenses} customers={db.customers} />;
            case 'Closing Report':
                return <ClosingReport
                    sales={db.sales}
                    expenses={db.expenses}
                    customers={db.customers}
                    closingRecords={db.closingRecords || []}
                    onInitiateClose={handleInitiateClose}
                />;
            case 'Cash / Bank Recon':
                return <CashRecon
                    sales={db.sales}
                    expenses={db.expenses}
                    inventory={db.inventory}
                    openingBalances={db.dailyOpeningBalances || []}
                />;
            case 'Daily Assignments':
                return <DailyBottlesAssigned
                    salesmen={db.salesmen}
                    assignments={db.dailyAssignments || []}
                    onAddAssignment={handleAddDailyAssignment}
                    onUpdateAssignment={handleUpdateDailyAssignment}
                />;
            case 'Outstanding':
                return <Outstanding customers={db.customers.filter(c => (Number(c.totalBalance) || 0) > 0)} />;
            case 'Delivery Schedule':
                return <DeliverySchedule
                    customers={db.customers}
                    sales={db.sales}
                    areaAssignments={db.areaAssignments || []}
                    salesmen={db.salesmen}
                    onNavigateToAreaAssignment={() => setActiveView('Area Assignment')}
                    onViewCustomerDetails={customer => { setSelectedCustomer(customer); setActiveView('CustomerDetail'); }}
                    onViewSalesmanDetails={(salesmanId) => {
                        const targetId = String(salesmanId);
                        const salesman = db.salesmen.find(s => String(s._id || s.id) === targetId);
                        if (salesman) {
                            setSelectedSalesman(salesman);
                            setActiveView('SalesmanDetail');
                        }
                    }}
                />;
            default:
                return <div>Select a view</div>;
        }
    };

    return (
        <div className="flex h-screen bg-brand-bg relative">
            
            {/* Global Syncing Overlay */}
            {isSyncing && (
                <div className="absolute inset-0 z-[100] bg-white/40 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white p-4 rounded-xl shadow-xl border border-blue-100 flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-blue mr-3"></div>
                        <span className="font-bold text-brand-blue">Syncing Database...</span>
                    </div>
                </div>
            )}

            <div className="print:hidden">
                <Sidebar activeView={activeView} onNavigate={handleNavigate} />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="print:hidden">
                    <Header user={user} notifications={notifications} onLogout={onLogout} />
                </div>
                <main className="flex-1 p-4 md:p-8 overflow-y-auto print:p-0 print:overflow-visible custom-scrollbar">
                    {renderContent()}
                </main>
            </div>

            {/* Modals */}
            <AddCustomerModal
                isOpen={isAddCustomerOpen}
                onClose={() => setAddCustomerOpen(false)}
                onAddCustomer={handleAddCustomer}
                salesmen={db.salesmen}
                areas={allAreas}
                areaAssignments={db.areaAssignments || []}
                onNavigateToAreaAssignment={() => { setAddCustomerOpen(false); setActiveView('Area Assignment'); }}
            />
            <EditCustomerModal
                isOpen={isEditCustomerOpen}
                onClose={() => setEditCustomerOpen(false)}
                customer={selectedCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                salesmen={db.salesmen}
                areas={allAreas}
                areaAssignments={db.areaAssignments || []}
                onNavigateToAreaAssignment={() => { setEditCustomerOpen(false); setActiveView('Area Assignment'); }}
            />
            <AddSaleModal
                isOpen={isAddSaleOpen}
                onClose={() => { setAddSaleOpen(false); setPreselectedItemId(undefined); setSelectedCustomer(null); }}
                onAddSale={handleAddSale}
                customer={selectedCustomer}
                customers={db.customers}
                salesmen={db.salesmen}
                inventory={db.inventory}
                preselectedInventoryItemId={preselectedItemId}
            />
            <EditSaleModal
                isOpen={isEditSaleOpen}
                onClose={() => setEditSaleOpen(false)}
                sale={selectedSale}
                onUpdateSale={handleUpdateSale}
                customers={db.customers}
                salesmen={db.salesmen}
                inventory={db.inventory}
            />
            <AddExpenseModal
                isOpen={isAddExpenseOpen}
                onClose={() => {
                    setAddExpenseOpen(false);
                    setPreselectedAccountId(null);
                }}
                onAddExpense={handleAddExpense}
                salesmen={db.salesmen}
                expenseOwners={db.expenseOwners || []}
                onAddOwner={handleAddExpenseOwner}
                preselectedAccountId={preselectedAccountId}
            />
            <EditExpenseModal
                isOpen={isEditExpenseOpen}
                onClose={() => setEditExpenseOpen(false)}
                expense={selectedExpense}
                onUpdateExpense={handleUpdateExpense}
                salesmen={db.salesmen}
                expenseOwners={db.expenseOwners || []}
            />
            <AddSalesmanModal 
                isOpen={isAddSalesmanOpen} 
                onClose={() => setAddSalesmanOpen(false)} 
                onAddSalesman={handleAddSalesman} 
            />
            <EditSalesmanModal 
                isOpen={isEditSalesmanOpen} 
                onClose={() => setEditSalesmanOpen(false)} 
                salesman={selectedSalesman} 
                onUpdateSalesman={handleUpdateSalesman} 
            />
            <AddSalesmanPaymentModal
                isOpen={isAddSalesmanPaymentOpen}
                onClose={() => setAddSalesmanPaymentOpen(false)}
                onAddPayment={handleAddSalesmanPayment}
                salesmen={db.salesmen}
                preselectedSalesmanId={selectedSalesman?._id || selectedSalesman?.id}
            />
            <AddInventoryItemModal 
                isOpen={isAddInventoryOpen} 
                onClose={() => setAddInventoryOpen(false)} 
                onAddItem={handleAddInventoryItem} 
            />
            <EditInventoryItemModal
                isOpen={isEditInventoryOpen}
                onClose={() => setEditInventoryOpen(false)}
                item={selectedInventoryItem}
                onUpdateItem={handleUpdateInventoryItem}
            />
            <UpdateStockModal
                isOpen={isUpdateStockOpen}
                onClose={() => setUpdateStockOpen(false)}
                item={selectedInventoryItem}
                onUpdateStock={handleUpdateStock}
            />
            <MarkAsPaidModal
                isOpen={isMarkAsPaidOpen}
                onClose={() => setMarkAsPaidOpen(false)}
                onConfirm={handleMarkAsPaid}
                customer={selectedCustomer}
            />
            <RecordPaymentModal
                isOpen={isRecordPaymentOpen}
                onClose={() => setRecordPaymentOpen(false)}
                customer={selectedCustomer}
                onConfirm={handleRecordPayment}
            />
            <CollectEmptiesModal
                isOpen={isCollectEmptiesOpen}
                onClose={() => setCollectEmptiesOpen(false)}
                customer={selectedCustomer}
                onConfirm={handleCollectEmpties}
            />
            <RecordOpeningBalanceModal
                isOpen={isRecordOpeningBalanceOpen}
                onClose={() => setRecordOpeningBalanceOpen(false)}
                onSave={handleSaveOpeningBalance}
                selectedDate={financialDate}
                currentBalance={(db.dailyOpeningBalances || []).find(b => b.date === financialDate)}
            />
            <ConfirmClosingModal
                isOpen={isConfirmClosingOpen}
                onClose={() => setConfirmClosingOpen(false)}
                onConfirm={handleConfirmClose}
                data={closingPeriodData}
            />
            <ConfirmationModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={handleDelete}
                title={`Confirm Deletion`}
                message={`Are you sure you want to permanently delete this ${itemToDelete?.type}? This action cannot be undone and may affect historical records.`}
            />
        </div>
    );
};

export default Dashboard;