import React, { useState, useMemo, useRef, useEffect } from 'react';
import { is19LItemName, is6LItemName } from '../../utils/payment-category';
import { getLocalDateString, getTodayLocalDateString } from '../../utils/date';
import Chart from 'chart.js/auto';

/**
 * Component for reconciling daily cash and bank balances.
 * @param {Object} props
 * @param {Array} props.sales - Array of sale transactions.
 * @param {Array} props.expenses - Array of expense records.
 * @param {Array} props.inventory - List of inventory items for ID lookup.
 * @param {Array} props.openingBalances - Historical daily opening balance records.
 */
const CashRecon = ({ sales = [], expenses = [], inventory = [], openingBalances = [] }) => {
    const [selectedDate, setSelectedDate] = useState(getTodayLocalDateString());
    const [registerCash, setRegisterCash] = useState('');
    const [registerBank, setRegisterBank] = useState('');
    
    const revenueChartRef = useRef(null);
    const revenueChartInstance = useRef(null);

    const formatCurrency = (amount) => {
        return (Number(amount) || 0).toLocaleString(undefined, { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
        });
    }

    const reconData = useMemo(() => {
        const selected = new Date(selectedDate);
        selected.setHours(0, 0, 0, 0);

        // Filter transactions for opening balance calculation
        const priorSales = sales.filter(s => getLocalDateString(s.date) < selectedDate);
        const priorExpenses = expenses.filter(e => getLocalDateString(e.date) < selectedDate);
        
        const recordedOpeningBalance = openingBalances.find(ob => ob.date === selectedDate);
        
        let openingCash = 0, openingBank = 0;
        
        if (recordedOpeningBalance) {
            openingCash = recordedOpeningBalance.cash || 0;
            openingBank = recordedOpeningBalance.bank || 0;
        } else {
            openingCash = priorSales.filter(s => s.paymentMethod === 'Cash').reduce((sum, s) => sum + (Number(s.amountReceived) || Number(s.amount) || 0), 0) - 
                          priorExpenses.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
            openingBank = priorSales.filter(s => s.paymentMethod === 'Bank').reduce((sum, s) => sum + (Number(s.amountReceived) || Number(s.amount) || 0), 0) - 
                          priorExpenses.filter(e => e.paymentMethod === 'Bank').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        }

        const todaySales = sales.filter(s => getLocalDateString(s.date) === selectedDate);
        const todayExpenses = expenses.filter(e => getLocalDateString(e.date) === selectedDate);

        const bottle19L = inventory.find(i => is19LItemName(i.name));
        const bottle6L = inventory.find(i => is6LItemName(i.name));
        
        // Ensure IDs are extracted as strings for reliable comparisons
        const bottle19LId = bottle19L ? String(bottle19L._id || bottle19L.id) : null;
        const bottle6LId = bottle6L ? String(bottle6L._id || bottle6L.id) : null;

        // 💡 THE FIX: Clean, bug-proof Revenue Bucket calculation
        let c19Cash = 0, c19Bank = 0;
        let c6Cash = 0, c6Bank = 0;
        let otherCash = 0, otherBank = 0;

        todaySales.forEach(s => {
            // Ignore pending bills/debts (no money was collected)
            if (s.paymentMethod === 'Pending') return; 
            
            // Sometimes manual counter sales only have `amount` instead of `amountReceived`. Safe fallback.
            const amount = Number(s.amountReceived) || Number(s.amount) || 0;
            if (amount <= 0) return;

            const method = s.paymentMethod;
            const sId = s.inventoryItemId ? String(s.inventoryItemId._id || s.inventoryItemId) : null;

            // Sort into 19L Bucket
            if (sId === bottle19LId || s.paymentForCategory === '19Ltr Collection') {
                if (method === 'Cash') c19Cash += amount;
                if (method === 'Bank') c19Bank += amount;
            } 
            // Sort into 6L Bucket
            else if (sId === bottle6LId || s.paymentForCategory === '6Ltr Collection') {
                if (method === 'Cash') c6Cash += amount;
                if (method === 'Bank') c6Bank += amount;
            } 
            // 💡 Sort into "Other/Counter Sale" Bucket (Safely catches Manual Sales where sId === null!)
            else {
                if (method === 'Cash') otherCash += amount;
                if (method === 'Bank') otherBank += amount;
            }
        });

        const collection19L = { cash: c19Cash, bank: c19Bank, total: c19Cash + c19Bank };
        const collection6L = { cash: c6Cash, bank: c6Bank, total: c6Cash + c6Bank };
        const counterSale = { cash: otherCash, bank: otherBank, total: otherCash + otherBank };

        const totalRevenue = {
            cash: collection19L.cash + collection6L.cash + counterSale.cash,
            bank: collection19L.bank + collection6L.bank + counterSale.bank,
            get total() { return this.cash + this.bank }
        };

        const calcExpense = (category) => {
            const filtered = category ? todayExpenses.filter(e => e.category === category) : todayExpenses;
            const cash = filtered.filter(e => e.paymentMethod === 'Cash').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
            const bank = filtered.filter(e => e.paymentMethod === 'Bank').reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
            return { cash, bank, total: cash + bank };
        };
        
        const totalExpense = calcExpense();
        const salaryExpense = calcExpense('Salaries');
        const homeExpense = calcExpense('Home');
        const shopExpense = calcExpense('Shop');
        
        const closingCash = openingCash + totalRevenue.cash - totalExpense.cash;
        const closingBank = openingBank + totalRevenue.bank - totalExpense.bank;
        
        return {
            opening: { cash: openingCash, bank: openingBank, total: openingCash + openingBank },
            collection19L,
            collection6L,
            counterSale,
            totalRevenue,
            totalExpense,
            salaryExpense,
            homeExpense,
            shopExpense,
            closing: { cash: closingCash, bank: closingBank, total: closingCash + closingBank },
        };
    }, [selectedDate, sales, expenses, inventory, openingBalances]);
    
    // Chart rendering logic
    useEffect(() => {
        if (revenueChartRef.current) {
            const { collection19L, collection6L, counterSale } = reconData;
            const chartData = {
                labels: ['19L Collection', '6L Collection', 'Counter Sale / Other'],
                datasets: [{
                    data: [collection19L.total, collection6L.total, counterSale.total],
                    backgroundColor: ['#1976D2', '#29B6F6', '#64B5F6'],
                    hoverBackgroundColor: ['#0D47A1', '#039BE5', '#42A5F5'],
                    borderWidth: 1,
                    borderColor: '#ffffff'
                }]
            };

            if (revenueChartInstance.current) {
                revenueChartInstance.current.destroy();
                revenueChartInstance.current = null;
            }

            const hasData = collection19L.total > 0 || collection6L.total > 0 || counterSale.total > 0;
            
            if (hasData) {
                 revenueChartInstance.current = new Chart(revenueChartRef.current, {
                    type: 'doughnut', 
                    data: chartData,
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '65%',
                        plugins: { 
                            legend: { 
                                position: 'right',
                                labels: { usePointStyle: true, padding: 20 }
                            } 
                        }
                    }
                });
            }
        }
        
        return () => {
            if (revenueChartInstance.current) {
                revenueChartInstance.current.destroy();
                revenueChartInstance.current = null;
            }
        };
    }, [reconData]);

    const numRegisterCash = Number(registerCash) || 0;
    const numRegisterBank = Number(registerBank) || 0;
    const differenceCash = reconData.closing.cash - numRegisterCash;
    const differenceBank = reconData.closing.bank - numRegisterBank;

    const renderRow = (title, data, isBold = false, isSub = false) => (
        <tr className={`border-b border-gray-100 ${isBold ? 'bg-gray-50/80 font-bold' : 'hover:bg-gray-50/50 transition-colors'}`}>
            <td className={`px-6 py-4 text-sm ${isSub ? 'pl-10 text-gray-500' : 'text-brand-text-primary'}`}>
                {isSub && <span className="mr-2 text-gray-300">↳</span>}
                {title}
            </td>
            <td className="px-6 py-4 text-right text-brand-text-secondary">{formatCurrency(data.cash)}</td>
            <td className="px-6 py-4 text-right text-brand-text-secondary">{formatCurrency(data.bank)}</td>
            <td className={`px-6 py-4 text-right ${isBold ? 'text-brand-blue font-black' : 'font-semibold text-brand-text-primary'}`}>
                {formatCurrency(data.total)}
            </td>
        </tr>
    );

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                 <div>
                     <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Daily Reconciliation</h1>
                     <p className="text-brand-text-secondary mt-1">Balance physical registers and bank accounts against digital records.</p>
                 </div>
                 <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-block">
                     <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="px-4 py-2 bg-transparent focus:outline-none focus:ring-0 text-brand-blue font-bold cursor-pointer"
                    />
                 </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-brand-text-primary mb-4 border-b border-gray-100 pb-2">
                        Revenue Breakdown
                    </h2>
                    
                    <div className="flex-grow relative min-h-[250px] flex items-center justify-center">
                        {(reconData.totalRevenue.total > 0) ? (
                            <>
                                <canvas ref={revenueChartRef}></canvas>
                            </>
                        ) : (
                            <div className="text-center text-brand-text-secondary flex flex-col items-center">
                                <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                                <p className="font-medium">No revenue data</p>
                                <p className="text-xs mt-1">Select a different date.</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-brand-text-secondary">
                            <thead className="text-xs text-brand-text-secondary uppercase bg-gray-100/80 font-bold tracking-wider border-b border-gray-200">
                                <tr>
                                    <th scope="col" className="px-6 py-4 w-2/5">Ledger Details</th>
                                    <th scope="col" className="px-6 py-4 text-right">Cash (PKR)</th>
                                    <th scope="col" className="px-6 py-4 text-right">Bank (PKR)</th>
                                    <th scope="col" className="px-6 py-4 text-right">Total (PKR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderRow('Opening Balance', reconData.opening, true)}
                                {renderRow('19L Collection', reconData.collection19L)}
                                {renderRow('6L Collection', reconData.collection6L)}
                                {renderRow('Counter Sale / Other', reconData.counterSale)}
                                {renderRow('Total Revenue', reconData.totalRevenue, true)}
                                {renderRow('Total Expenses', reconData.totalExpense, true)}
                                {renderRow('Salaries Paid', reconData.salaryExpense, false, true)}
                                {renderRow('Home Expenses', reconData.homeExpense, false, true)}
                                {renderRow('Shop Expenses', reconData.shopExpense, false, true)}
                                {renderRow('Expected Closing', reconData.closing, true)}
                                
                                {/* Manual Entry Section */}
                                <tr className="border-b border-gray-200 bg-blue-50/30">
                                    <td className="px-6 py-4 text-sm font-bold text-brand-blue uppercase tracking-wide">
                                        Physical Register Check
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                        <input 
                                            type="number" 
                                            value={registerCash} 
                                            placeholder="Enter Cash"
                                            onChange={e => setRegisterCash(e.target.value)} 
                                            className="w-full max-w-[120px] text-right bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue font-semibold text-brand-text-primary shadow-inner"
                                        />
                                    </td>
                                    <td className="px-3 py-3 text-right">
                                         <input 
                                            type="number" 
                                            value={registerBank} 
                                            placeholder="Enter Bank"
                                            onChange={e => setRegisterBank(e.target.value)} 
                                            className="w-full max-w-[120px] text-right bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-brand-blue font-semibold text-brand-text-primary shadow-inner"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-brand-text-primary text-lg">
                                        {formatCurrency(numRegisterCash + numRegisterBank)}
                                    </td>
                                </tr>

                                {/* Variance/Difference row */}
                                <tr className={`${(differenceCash !== 0 || differenceBank !== 0) ? 'bg-red-50' : 'bg-green-50'}`}>
                                    <td className="px-6 py-4 text-sm font-black uppercase tracking-wider text-gray-800">
                                        Variance (Difference)
                                    </td>
                                    <td className={`px-6 py-4 text-right font-black ${differenceCash !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(differenceCash)}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-black ${differenceBank !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(differenceBank)}
                                    </td>
                                    <td className={`px-6 py-4 text-right font-black text-xl ${(differenceCash + differenceBank) !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(differenceCash + differenceBank)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashRecon;