
import React, { useEffect, useRef, useMemo } from 'react';
import StatCard from './StatCard';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { BarChartIcon } from '../icons/BarChartIcon';
import Chart from 'chart.js/auto';

/**
 * Component for visual business analytics and financial reporting.
 * @param {Object} props
 * @param {Array} props.sales - Global sales history.
 * @param {Array} props.expenses - Global expense records.
 * @param {Array} props.customers - Global customer list for balance tracking.
 */
const Reports = ({ sales = [], expenses = [], customers = [] }) => {
    const salesChartRef = useRef(null);
    const expensesChartRef = useRef(null);
    const salesChartInstance = useRef(null);
    const expensesChartInstance = useRef(null);

    // Calculate core financial metrics
    const stats = useMemo(() => {
        const totalSales = sales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
        const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
        const pendingBalances = customers.reduce((sum, c) => sum + (Number(c.totalBalance) || 0), 0);
        
        return {
            totalSales,
            totalExpenses,
            netProfit: totalSales - totalExpenses,
            pendingBalances,
        }
    }, [sales, expenses, customers]);

    useEffect(() => {
        // --- Sales Trend Line Chart ---
        if (salesChartRef.current && sales.length > 0) {
            const salesByDate = sales.reduce((acc, sale) => {
                if (!sale.date) return acc;
                const date = new Date(sale.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
                acc[date] = (acc[date] || 0) + (Number(sale.amount) || 0);
                return acc;
            }, {});

            // Generate last 7 days for x-axis
            const last7Days = Array.from({ length: 7 }, (_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - i);
                return d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
            }).reverse();
            
            if (salesChartInstance.current) {
                salesChartInstance.current.destroy();
            }

            salesChartInstance.current = new Chart(salesChartRef.current, {
                type: 'line',
                data: {
                    labels: last7Days,
                    datasets: [{
                        label: 'Gross Revenue (PKR)',
                        data: last7Days.map(date => salesByDate[date] || 0),
                        borderColor: '#2563EB', // brand-blue
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        fill: true,
                        tension: 0.4,
                        borderWidth: 3,
                        pointBackgroundColor: '#ffffff',
                        pointBorderColor: '#2563EB',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            padding: 12,
                            titleFont: { size: 14, family: "'Inter', sans-serif" },
                            bodyFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return 'PKR ' + context.parsed.y.toLocaleString();
                                }
                            }
                        }
                    },
                    scales: {
                        y: { 
                            beginAtZero: true,
                            grid: { color: '#f3f4f6', drawBorder: false },
                            ticks: { 
                                font: { family: "'Inter', sans-serif" },
                                callback: function(value) { return 'PKR ' + value.toLocaleString(); }
                            }
                        },
                        x: {
                            grid: { display: false, drawBorder: false },
                            ticks: { font: { family: "'Inter', sans-serif" } }
                        }
                    }
                }
            });
        }
        
        // --- Expenses Category Doughnut Chart ---
        if (expensesChartRef.current && expenses.length > 0) {
             const expensesByCategory = expenses.reduce((acc, expense) => {
                const cat = expense.category || 'Uncategorized';
                acc[cat] = (acc[cat] || 0) + (Number(expense.amount) || 0);
                return acc;
            }, {});

            if (expensesChartInstance.current) {
                expensesChartInstance.current.destroy();
            }

            expensesChartInstance.current = new Chart(expensesChartRef.current, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(expensesByCategory),
                    datasets: [{
                        data: Object.values(expensesByCategory),
                        backgroundColor: ['#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#64748B', '#FCD34D'],
                        borderWidth: 2,
                        borderColor: '#ffffff',
                        hoverOffset: 4
                    }]
                },
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { 
                            position: 'right',
                            labels: { usePointStyle: true, padding: 20, font: { family: "'Inter', sans-serif" } }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                            padding: 12,
                            bodyFont: { size: 14, weight: 'bold', family: "'Inter', sans-serif" },
                            callbacks: {
                                label: function(context) {
                                    return ' PKR ' + context.parsed.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Cleanup function to prevent memory leaks and chart canvas flickering
        return () => {
            if (salesChartInstance.current) salesChartInstance.current.destroy();
            if (expensesChartInstance.current) expensesChartInstance.current.destroy();
        }

    }, [sales, expenses]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Business Reports</h1>
                <p className="text-brand-text-secondary mt-1">High-level financial overview and analytics.</p>
            </div>
            
            

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`PKR ${stats.totalSales.toLocaleString()}`} 
                    icon={<DollarSignIcon />} 
                    color="text-green-500" 
                />
                <StatCard 
                    title="Total Expenses" 
                    value={`PKR ${stats.totalExpenses.toLocaleString()}`} 
                    icon={<CreditCardIcon />} 
                    color="text-red-500" 
                />
                <StatCard 
                    title="Net Profit" 
                    value={`PKR ${stats.netProfit.toLocaleString()}`} 
                    icon={<BarChartIcon />} 
                    color={stats.netProfit >= 0 ? "text-brand-blue" : "text-red-500"}
                />
                 <StatCard 
                    title="Outstanding Balances" 
                    value={`PKR ${stats.pendingBalances.toLocaleString()}`} 
                    icon={<CreditCardIcon />} 
                    color="text-yellow-500" 
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-brand-text-primary tracking-tight">Revenue Trend</h2>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase tracking-wider">Last 7 Days</span>
                    </div>
                    <div className="flex-grow relative w-full h-full">
                        {sales.length > 0 ? (
                            <canvas ref={salesChartRef}></canvas>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                                <p className="font-medium">No sales data available</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col h-[400px]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-brand-text-primary tracking-tight">Expense Distribution</h2>
                    </div>
                    <div className="flex-grow relative w-full h-full">
                        {expenses.length > 0 ? (
                            <canvas ref={expensesChartRef}></canvas>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <svg className="w-12 h-12 mb-3 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                                <p className="font-medium">No expense data available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;