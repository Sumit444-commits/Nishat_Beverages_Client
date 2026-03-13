import React, { useState, useMemo } from 'react';
import { PrinterIcon } from '../icons/PrinterIcon';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';

/**
 * Component for generating and viewing financial closing reports.
 * Includes monthly closing triggers and period-based filtering.
 * @param {Object} props
 * @param {Array} props.sales - List of all sales transactions.
 * @param {Array} props.expenses - List of all recorded expenses.
 * @param {Array} props.customers - List of customers for name lookup.
 * @param {Array} props.closingRecords - Historical records of finalized months.
 * @param {Function} props.onInitiateClose - Callback to trigger a month finalization.
 */
const ClosingReport = ({ sales = [], expenses = [], customers = [], closingRecords = [], onInitiateClose }) => {
    const [activePeriod, setActivePeriod] = useState('Today');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');

    const getCustomerName = (customerId) => {
        if (!customerId) return 'Counter Sale';
        const targetId = String(typeof customerId === 'object' ? customerId._id : customerId);
        const customer = customers.find(c => String(c._id || c.id) === targetId);
        return customer ? customer.name : 'Unknown Customer';
    };

    /**
     * Logic to calculate statistics for the previous calendar month
     * to facilitate the "Monthly Closing" process.
     */
    const previousMonthData = useMemo(() => {
        const now = new Date();
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const year = prevMonthDate.getFullYear();
        const month = prevMonthDate.getMonth();
        const periodString = `${year}-${String(month + 1).padStart(2, '0')}`;

        const salesForMonth = sales.filter(s => {
            if (!s.date) return false;
            const saleDate = new Date(s.date);
            return saleDate.getFullYear() === year && saleDate.getMonth() === month;
        });
        
        const expensesForMonth = expenses.filter(e => {
            if (!e.date) return false;
            const expenseDate = new Date(e.date);
            return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
        });

        const cashRevenue = salesForMonth.filter(s => s.paymentMethod === 'Cash').reduce((sum, s) => sum + (Number(s.amountReceived) || 0), 0);
        const bankRevenue = salesForMonth.filter(s => s.paymentMethod === 'Bank').reduce((sum, s) => sum + (Number(s.amountReceived) || 0), 0);
        const cashExpenses = expensesForMonth.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        const bankExpenses = expensesForMonth.filter(e => e.paymentMethod === 'Bank').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        
        const totalRevenue = cashRevenue + bankRevenue;
        const totalExpenses = cashExpenses + bankExpenses;
        const netBalance = totalRevenue - totalExpenses;

        return {
            period: periodString,
            periodName: prevMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
            cashRevenue,
            bankRevenue,
            totalRevenue,
            cashExpenses,
            bankExpenses,
            totalExpenses,
            netBalance,
        };
    }, [sales, expenses]);

    const isPreviousMonthClosed = useMemo(() => {
        return (closingRecords || []).some(r => r.period === previousMonthData.period);
    }, [closingRecords, previousMonthData.period]);

    const handleCloseMonthClick = () => {
        onInitiateClose(previousMonthData);
    };

    /**
     * Logic to filter current view data based on period selection (Today/Month/Year)
     */
    const filteredData = useMemo(() => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisYearStart = new Date(now.getFullYear(), 0, 1);

        const filteredSales = sales.filter(s => {
            if (!s.date) return false;
            const saleDate = new Date(s.date);
            switch (activePeriod) {
                case 'Today': return saleDate >= today;
                case 'This Month': return saleDate >= thisMonthStart;
                case 'This Year': return saleDate >= thisYearStart;
                default: return true;
            }
        }).filter(s => {
            if (paymentMethodFilter === 'All') return true;
            // Matches method directly or handles edge case for Pending sales with partial payments
            return s.paymentMethod === paymentMethodFilter || 
                   (s.paymentMethod === 'Pending' && (Number(s.amountReceived) || 0) > 0 && paymentMethodFilter === 'Cash');
        });

        const filteredExpenses = expenses.filter(e => {
            if (!e.date) return false;
            const expenseDate = new Date(e.date);
             switch (activePeriod) {
                case 'Today': return expenseDate >= today;
                case 'This Month': return expenseDate >= thisMonthStart;
                case 'This Year': return expenseDate >= thisYearStart;
                default: return true;
            }
        }).filter(e => {
            if (paymentMethodFilter === 'All') return true;
            return e.paymentMethod === paymentMethodFilter;
        });

        return { filteredSales, filteredExpenses };
    }, [sales, expenses, activePeriod, paymentMethodFilter]);

    const stats = useMemo(() => {
        const { filteredSales, filteredExpenses } = filteredData;
        
        const cashRevenue = filteredSales.filter(s => s.paymentMethod === 'Cash' || (s.paymentMethod === 'Pending' && (Number(s.amountReceived) || 0) > 0)).reduce((sum, s) => sum + (Number(s.amountReceived) || 0), 0);
        const bankRevenue = filteredSales.filter(s => s.paymentMethod === 'Bank').reduce((sum, s) => sum + (Number(s.amountReceived) || 0), 0);
        const cashExpenses = filteredExpenses.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        const bankExpenses = filteredExpenses.filter(e => e.paymentMethod === 'Bank').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        const totalRevenue = cashRevenue + bankRevenue;
        const totalExpenses = cashExpenses + bankExpenses;
        const netCashFlow = totalRevenue - totalExpenses;

        const expensesByCategory = filteredExpenses.reduce((acc, expense) => {
            const cat = expense.category || 'Uncategorized';
            if (!acc[cat]) {
                acc[cat] = { cash: 0, bank: 0, total: 0 };
            }
            if (expense.paymentMethod === 'Cash') {
                acc[cat].cash += (Number(expense.amount) || 0);
            } else {
                acc[cat].bank += (Number(expense.amount) || 0);
            }
            acc[cat].total += (Number(expense.amount) || 0);
            return acc;
        }, {});

        return { cashRevenue, bankRevenue, cashExpenses, bankExpenses, totalRevenue, totalExpenses, netCashFlow, expensesByCategory };
    }, [filteredData]);

    const handlePrint = () => window.print();

    const periodButtons = ['Today', 'This Month', 'This Year', 'All Time'];
    const paymentMethodButtons = ['All', 'Cash', 'Bank'];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 print:hidden">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Closing Report</h1>
                    <p className="text-brand-text-secondary mt-1">Review financial summaries and process month-end closures.</p>
                </div>
                <div className="flex items-center space-x-3 overflow-x-auto pb-2 md:pb-0">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {periodButtons.map(period => (
                            <button 
                                key={period} 
                                onClick={() => setActivePeriod(period)}
                                className={`px-4 py-2 text-sm font-bold rounded-md transition-all whitespace-nowrap ${
                                    activePeriod === period 
                                        ? 'bg-white text-brand-blue shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                         {paymentMethodButtons.map(method => (
                            <button 
                                key={method} 
                                onClick={() => setPaymentMethodFilter(method)}
                                className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                                    paymentMethodFilter === method 
                                        ? 'bg-brand-blue text-white shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {method}
                            </button>
                        ))}
                    </div>
                    
                    <button 
                        onClick={handlePrint} 
                        className="flex items-center bg-white border border-gray-200 text-brand-text-primary px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
                    >
                        <PrinterIcon className="h-5 w-5 mr-2 text-brand-text-secondary" />
                        Print
                    </button>
                </div>
            </div>
            
            

            {/* Monthly Closing Action Card */}
            <div className="bg-brand-blue rounded-xl shadow-lg p-6 mb-6 print:hidden text-white flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-black">Monthly Closing</h2>
                    <p className="text-blue-100 mt-1">
                        Finalize financial records and lock transactions for: <span className="font-bold text-white">{previousMonthData.periodName}</span>.
                    </p>
                </div>
                <div>
                    <button 
                        onClick={handleCloseMonthClick}
                        disabled={isPreviousMonthClosed}
                        className={`px-6 py-3 rounded-lg font-black transition-all shadow-md active:scale-95 ${
                            isPreviousMonthClosed 
                                ? 'bg-white/20 text-white cursor-not-allowed shadow-none' 
                                : 'bg-white text-brand-blue hover:bg-gray-50'
                        }`}
                    >
                        {isPreviousMonthClosed ? `✓ ${previousMonthData.periodName} Closed` : `Close ${previousMonthData.periodName}`}
                    </button>
                </div>
            </div>

            <div className="text-center py-4 print:block hidden">
                <h2 className="text-2xl font-black text-brand-text-primary uppercase tracking-widest border-b-2 border-black inline-block pb-2">Financial Summary</h2>
                <p className="text-brand-text-secondary mt-2 font-medium">Period: {activePeriod} | Payment Method: {paymentMethodFilter}</p>
            </div>

            {/* Top Level Financial Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Cash Revenue</p>
                    <p className="text-3xl font-black text-brand-text-primary mt-2">PKR {stats.cashRevenue.toLocaleString()}</p>
                </div>
                 <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                    <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Bank Revenue</p>
                    <p className="text-3xl font-black text-brand-text-primary mt-2">PKR {stats.bankRevenue.toLocaleString()}</p>
                </div>
                 <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                    <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Total Expenses</p>
                    <p className="text-3xl font-black text-red-600 mt-2">PKR {stats.totalExpenses.toLocaleString()}</p>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-gray-50 text-xs font-bold text-gray-500">
                        <p>Cash: {stats.cashExpenses.toLocaleString()}</p>
                        <p>Bank: {stats.bankExpenses.toLocaleString()}</p>
                    </div>
                </div>
                 <div className="p-6 rounded-xl bg-gray-900 shadow-lg relative overflow-hidden">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Net Cash Flow</p>
                    <p className={`text-4xl font-black mt-2 ${stats.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        PKR {stats.netCashFlow.toLocaleString()}
                    </p>
                    <div className="flex justify-between mt-3 pt-3 border-t border-gray-800 text-xs font-bold text-gray-500">
                        <p>Rev: {stats.totalRevenue.toLocaleString()}</p>
                        <p>Exp: {stats.totalExpenses.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Expense Breakdown */}
            {Object.keys(stats.expensesByCategory).length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 bg-gray-50/80 border-b border-gray-100">
                        <h3 className="font-black text-brand-text-primary tracking-tight text-lg">Expense Categories</h3>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {Object.entries(stats.expensesByCategory)
                                .sort(([,a], [,b]) => b.total - a.total)
                                .map(([category, amounts]) => (
                                <div key={category} className="border border-gray-100 rounded-lg p-4 bg-white shadow-sm hover:border-brand-blue transition-colors">
                                    <h4 className="font-bold text-brand-text-primary mb-3 text-sm uppercase tracking-wider">{category}</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-brand-text-secondary font-medium">
                                            <span>Cash:</span>
                                            <span>{amounts.cash.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-brand-text-secondary font-medium">
                                            <span>Bank:</span>
                                            <span>{amounts.bank.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-100 font-black text-red-600">
                                            <span>Total:</span>
                                            <span>{amounts.total.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Detail Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:block print:space-y-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/80 flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                            <DollarSignIcon className="h-5 w-5 text-green-700" />
                        </div>
                        <h3 className="font-black text-brand-text-primary text-lg">Sales Revenue Details</h3>
                    </div>
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto print:max-h-none">
                        {filteredData.filteredSales.length > 0 ? (
                             <table className="w-full text-sm text-left">
                                <thead className="text-xs text-brand-text-secondary uppercase bg-white sticky top-0 border-b border-gray-200 font-bold tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Customer</th>
                                        <th className="py-3 px-4 text-center">Type</th>
                                        <th className="py-3 px-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredData.filteredSales
                                        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map(sale => (
                                        <tr key={sale._id || sale.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 whitespace-nowrap text-brand-text-secondary">{new Date(sale.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</td>
                                            <td className="py-3 px-4 font-bold text-brand-text-primary whitespace-nowrap">{getCustomerName(sale.customerId)}</td>
                                            <td className="py-3 px-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${sale.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {sale.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-black text-green-600 whitespace-nowrap">{Number(sale.amountReceived || 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-center text-gray-400 py-10 font-medium italic">No sales match the current filters.</p>}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/80 flex items-center">
                        <div className="bg-red-100 p-2 rounded-lg mr-3">
                            <CreditCardIcon className="h-5 w-5 text-red-700" />
                        </div>
                        <h3 className="font-black text-brand-text-primary text-lg">Expense Details</h3>
                    </div>
                     <div className="overflow-x-auto max-h-[400px] overflow-y-auto print:max-h-none">
                        {filteredData.filteredExpenses.length > 0 ? (
                             <table className="w-full text-sm text-left">
                                <thead className="text-xs text-brand-text-secondary uppercase bg-white sticky top-0 border-b border-gray-200 font-bold tracking-wider">
                                    <tr>
                                        <th className="py-3 px-4">Date</th>
                                        <th className="py-3 px-4">Expense Title</th>
                                        <th className="py-3 px-4">Category</th>
                                        <th className="py-3 px-4 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredData.filteredExpenses
                                        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map(expense => (
                                        <tr key={expense._id || expense.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-4 whitespace-nowrap text-brand-text-secondary">{new Date(expense.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})}</td>
                                            <td className="py-3 px-4 font-bold text-brand-text-primary truncate max-w-[150px]" title={expense.name}>{expense.name}</td>
                                            <td className="py-3 px-4">
                                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right font-black text-red-600 whitespace-nowrap">{Number(expense.amount || 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : <p className="text-center text-gray-400 py-10 font-medium italic">No expenses match the current filters.</p>}
                    </div>
                </div>
            </div>
            
            {/* Historical Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mt-8 print:hidden">
                <div className="p-6 bg-gray-50 border-b border-gray-100">
                     <h3 className="font-black text-brand-text-primary text-xl tracking-tight">Historical Monthly Closings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-white text-brand-text-secondary uppercase text-xs font-bold tracking-wider border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Period</th>
                                <th className="px-6 py-4">Cash Revenue</th>
                                <th className="px-6 py-4">Bank Revenue</th>
                                <th className="px-6 py-4">Total Expenses</th>
                                <th className="px-6 py-4">Net Balance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {closingRecords.length > 0 ? closingRecords
                                .sort((a,b) => b.period.localeCompare(a.period))
                                .map(record => (
                                <tr key={record._id || record.id || record.period} className="hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-5 font-black text-brand-blue">{record.periodName || record.period}</td>
                                    <td className="px-6 py-5 font-semibold text-brand-text-secondary">PKR {Number(record.cashRevenue || 0).toLocaleString()}</td>
                                    <td className="px-6 py-5 font-semibold text-brand-text-secondary">PKR {Number(record.bankRevenue || 0).toLocaleString()}</td>
                                    <td className="px-6 py-5 font-bold text-red-500">PKR {Number((record.cashExpenses || 0) + (record.bankExpenses || 0)).toLocaleString()}</td>
                                    <td className={`px-6 py-5 font-black text-lg ${record.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        PKR {Number(record.netBalance || 0).toLocaleString()}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-12">
                                        <p className="text-gray-400 font-medium text-lg">No historical records found.</p>
                                        <p className="text-gray-400 text-sm mt-1">Close your first month to see history here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClosingReport;