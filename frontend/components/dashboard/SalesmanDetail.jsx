// import React, { useState, useMemo } from 'react';
// import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
// import StatCard from './StatCard';
// import { UsersIcon } from '../icons/UsersIcon';
// import { PackageIcon } from '../icons/PackageIcon';
// import { DollarSignIcon } from '../icons/DollarSignIcon';
// import { PlusCircleIcon } from '../icons/PlusCircleIcon';

// /**
//  * Detailed view for a specific salesman.
//  * Tracks assignments, salary payments, and performance analytics.
//  */
// const SalesmanDetail = ({ 
//     salesman, 
//     customers, 
//     sales, 
//     salesmanPayments, 
//     areaAssignments, 
//     onBack, 
//     onViewCustomerDetails, 
//     onViewReport, 
//     onAddPayment 
// }) => {
//     const [startDate, setStartDate] = useState('');
//     const [endDate, setEndDate] = useState('');
//     const [performancePeriod, setPerformancePeriod] = useState('Monthly');

//     // Data Filtering & Aggregation
//     const assignedCustomers = customers.filter(c => c.salesmanId === salesman.id);
//     const salesBySalesman = sales.filter(s => s.salesmanId === salesman.id);
//     const totalQuantitySoldAllTime = salesBySalesman.reduce((sum, s) => sum + s.quantity, 0);
    
//     const assignedAreas = useMemo(() => {
//         return areaAssignments
//             .filter(a => a.salesmanId === salesman.id)
//             .map(a => a.area);
//     }, [areaAssignments, salesman.id]);
    
//     const customersByArea = useMemo(() => {
//         const grouped = {};
//         assignedCustomers.forEach(customer => {
//             if (customer.area) {
//                 const area = customer.area.trim();
//                 if (!grouped[area]) {
//                     grouped[area] = [];
//                 }
//                 grouped[area].push(customer);
//             }
//         });
//         return grouped;
//     }, [assignedCustomers]);

//     const paymentsForSalesman = useMemo(() => {
//         return salesmanPayments
//             .filter(p => p.salesmanId === salesman.id)
//             .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//     }, [salesmanPayments, salesman.id]);

//     // Salary Logic: Tracks monthly progress against the monthlySalary property
//     const salaryStats = useMemo(() => {
//         const now = new Date();
//         const month = now.getMonth();
//         const year = now.getFullYear();
//         const paidThisMonth = paymentsForSalesman
//             .filter(p => {
//                 const d = new Date(p.date);
//                 return d.getMonth() === month && d.getFullYear() === year;
//             })
//             .reduce((sum, p) => sum + p.amount, 0);
            
//         const balanceThisMonth = Math.max(salesman.monthlySalary - paidThisMonth, 0);
//         const totalPaidAllTime = paymentsForSalesman.reduce((sum, p) => sum + p.amount, 0);
        
//         return { paidThisMonth, balanceThisMonth, totalPaidAllTime };
//     }, [paymentsForSalesman, salesman.monthlySalary]);

//     const getCustomerName = (customerId) => {
//         return customers.find(c => c.id === customerId)?.name || 'Unknown';
//     };

//     // Performance calculation based on time window
//     const performanceStats = useMemo(() => {
//         const now = new Date();
//         let periodStartDate = new Date();

//         switch (performancePeriod) {
//             case 'Weekly':
//                 periodStartDate.setDate(now.getDate() - 7);
//                 break;
//             case 'Monthly':
//                 periodStartDate.setMonth(now.getMonth() - 1);
//                 break;
//             case 'Yearly':
//                 periodStartDate.setFullYear(now.getFullYear() - 1);
//                 break;
//             default:
//                 break;
//         }

//         const salesInPeriod = salesBySalesman.filter(sale => new Date(sale.date) >= periodStartDate);
        
//         return {
//             quantity: salesInPeriod.reduce((sum, s) => sum + s.quantity, 0),
//             revenue: salesInPeriod.reduce((sum, s) => sum + s.amount, 0),
//             transactions: salesInPeriod.length,
//         };
//     }, [salesBySalesman, performancePeriod]);

//     // Secondary filter for the sales history table
//     const filteredSales = useMemo(() => {
//         const sorted = [...salesBySalesman].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//         if (!startDate && !endDate) return sorted;

//         return sorted.filter(sale => {
//             const saleDate = sale.date.split('T')[0];
//             if (startDate && saleDate < startDate) return false;
//             if (endDate && saleDate > endDate) return false;
//             return true;
//         });
//     }, [salesBySalesman, startDate, endDate]);
    
//     const periodButtons = ['Weekly', 'Monthly', 'Yearly'];

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-start flex-wrap gap-4">
//                  <div>
//                      <button onClick={onBack} className="flex items-center text-sm font-semibold text-brand-text-secondary hover:text-brand-blue mb-2 transition-colors">
//                         <ArrowLeftIcon className="h-4 w-4 mr-2" />
//                         Back to Salesmen
//                     </button>
//                     <h1 className="text-3xl font-bold text-brand-text-primary">{salesman.name}</h1>
//                     <p className="text-brand-text-secondary">Mobile: {salesman.mobile} | Hired: {new Date(salesman.hireDate).toLocaleDateString()}</p>
//                 </div>
//                 <div className="flex items-center space-x-3">
//                     <button
//                         onClick={onAddPayment}
//                         className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md"
//                     >
//                         <PlusCircleIcon className="h-5 w-5 mr-2" />
//                         Record Payment
//                     </button>
//                     <button
//                         onClick={onViewReport}
//                         className="bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors shadow-sm"
//                     >
//                         View Daily Report
//                     </button>
//                 </div>
//             </div>
            
            

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                  <StatCard title="Assigned Customers" value={assignedCustomers.length.toString()} icon={<UsersIcon />} />
//                  <StatCard title="Assigned Areas" value={assignedAreas.length.toString()} icon={<PackageIcon />} color="text-blue-500" />
//                  <StatCard title="Total Units Sold" value={totalQuantitySoldAllTime.toString()} icon={<PackageIcon />} />
//                  <StatCard title="Units Sold Today" value={salesman.quantitySoldToday.toString()} icon={<PackageIcon />} color="text-green-500" />
//             </div>
            
//             {/* Areas Mapping Section */}
//             {assignedAreas.length > 0 && (
//                 <div className="bg-brand-surface rounded-xl shadow-md p-6">
//                     <h2 className="text-xl font-bold text-brand-text-primary mb-4 uppercase tracking-wider text-sm">Assigned Territories</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                         {assignedAreas.map(area => (
//                             <div key={area} className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
//                                 <div className="flex justify-between items-start mb-2">
//                                     <h3 className="font-bold text-brand-text-primary">{area}</h3>
//                                     <span className="text-xs font-bold text-brand-blue bg-blue-50 px-2 py-1 rounded">
//                                         {customersByArea[area]?.length || 0} clients
//                                     </span>
//                                 </div>
//                                 {customersByArea[area]?.length > 0 && (
//                                     <div className="mt-2 text-[10px] text-brand-text-secondary uppercase font-semibold">
//                                         {customersByArea[area].slice(0, 2).map(c => c.name).join(' • ')}
//                                         {customersByArea[area].length > 2 && ` +${customersByArea[area].length - 2} others`}
//                                     </div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             )}
            
//             {/* Financial Ledger Summary */}
//             <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-100">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-brand-text-primary flex items-center">
//                         <DollarSignIcon className="h-6 w-6 mr-2 text-green-500" />
//                         Salary Ledger
//                     </h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <StatCard title="Monthly Salary" value={`PKR ${salesman.monthlySalary.toLocaleString()}`} icon={<DollarSignIcon />} color="text-purple-500" />
//                     <StatCard title="Paid (This Month)" value={`PKR ${salaryStats.paidThisMonth.toLocaleString()}`} icon={<DollarSignIcon />} color="text-green-600" />
//                     <StatCard title="Remaining Balance" value={`PKR ${salaryStats.balanceThisMonth.toLocaleString()}`} icon={<DollarSignIcon />} color="text-red-500" />
//                 </div>
//             </div>

//             {/* Performance Analytics */}
//             <div className="bg-brand-surface rounded-xl shadow-md p-6">
//                 <div className="flex justify-between items-center mb-4 flex-wrap gap-2 border-b pb-4">
//                     <h2 className="text-xl font-bold text-brand-text-primary">Performance Benchmarks</h2>
//                     <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
//                         {periodButtons.map(period => (
//                             <button 
//                                 key={period} 
//                                 onClick={() => setPerformancePeriod(period)}
//                                 className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${performancePeriod === period ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//                             >
//                                 {period}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <StatCard title={`Items Sold`} value={performanceStats.quantity.toLocaleString()} icon={<PackageIcon />} color="text-indigo-500" />
//                     <StatCard title={`Revenue Generated`} value={`PKR ${performanceStats.revenue.toLocaleString()}`} icon={<DollarSignIcon />} color="text-green-500" />
//                     <StatCard title={`Total Drops`} value={performanceStats.transactions.toLocaleString()} icon={<UsersIcon />} color="text-blue-500" />
//                 </div>
//             </div>

//             {/* Transactional History Tables */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Sales Sub-ledger */}
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col border border-gray-100">
//                     <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
//                         <h2 className="font-bold text-brand-text-primary">Sales History</h2>
//                         <div className="flex space-x-2">
//                              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-[10px] p-1 border rounded" />
//                              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-[10px] p-1 border rounded" />
//                         </div>
//                     </div>
//                     <div className="overflow-y-auto max-h-80">
//                         <table className="w-full text-xs text-left">
//                             <thead className="bg-gray-50 text-gray-500 uppercase sticky top-0">
//                                 <tr>
//                                     <th className="px-4 py-2">Date</th>
//                                     <th className="px-4 py-2">Customer</th>
//                                     <th className="px-4 py-2 text-right">Amount</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-100">
//                                 {filteredSales.map(sale => (
//                                     <tr key={sale.id} className="hover:bg-gray-50">
//                                         <td className="px-4 py-2">{new Date(sale.date).toLocaleDateString()}</td>
//                                         <td className="px-4 py-2 font-medium">{getCustomerName(sale.customerId)}</td>
//                                         <td className="px-4 py-2 text-right font-bold">PKR {sale.amount.toLocaleString()}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Salary Disbursement History */}
//                 <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
//                     <div className="p-4 border-b bg-gray-50">
//                         <h2 className="font-bold text-brand-text-primary">Disbursement History</h2>
//                     </div>
//                     <div className="overflow-y-auto max-h-80">
//                         <table className="w-full text-xs text-left">
//                             <thead className="bg-gray-50 text-gray-500 uppercase sticky top-0">
//                                 <tr>
//                                     <th className="px-4 py-2">Date</th>
//                                     <th className="px-4 py-2">Amount</th>
//                                     <th className="px-4 py-2">Method</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-100">
//                                 {paymentsForSalesman.map(p => (
//                                     <tr key={p.id} className="hover:bg-gray-50">
//                                         <td className="px-4 py-2">{new Date(p.date).toLocaleDateString()}</td>
//                                         <td className="px-4 py-2 font-bold text-green-600">PKR {p.amount.toLocaleString()}</td>
//                                         <td className="px-4 py-2">{p.paymentMethod}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalesmanDetail;











import React, { useState, useMemo } from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import StatCard from './StatCard';
import { UsersIcon } from '../icons/UsersIcon';
import { PackageIcon } from '../icons/PackageIcon';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { TruckIcon } from '../icons/TruckIcon';

/**
 * Detailed view for a specific salesman.
 * Tracks assignments, salary payments, and performance analytics.
 */
const SalesmanDetail = ({ 
    salesman, 
    customers = [], 
    sales = [], 
    salesmanPayments = [], 
    areaAssignments = [], 
    onBack, 
    onViewCustomerDetails, 
    onViewReport, 
    onAddPayment 
}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [performancePeriod, setPerformancePeriod] = useState('Monthly');

    if (!salesman) return null;

    const salesmanIdStr = String(salesman._id || salesman.id);

    // Data Filtering & Aggregation using stringified IDs
    const assignedCustomers = customers.filter(c => {
        const cId = c.salesmanId ? String(c.salesmanId._id || c.salesmanId) : null;
        return cId === salesmanIdStr;
    });

    const salesBySalesman = sales.filter(s => {
        const sId = s.salesmanId ? String(s.salesmanId._id || s.salesmanId) : null;
        return sId === salesmanIdStr;
    });

    const totalQuantitySoldAllTime = salesBySalesman.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    
    const assignedAreas = useMemo(() => {
        return areaAssignments
            .filter(a => {
                const sId = a.salesmanId ? String(a.salesmanId._id || a.salesmanId) : null;
                return sId === salesmanIdStr;
            })
            .map(a => a.area);
    }, [areaAssignments, salesmanIdStr]);
    
    const customersByArea = useMemo(() => {
        const grouped = {};
        assignedCustomers.forEach(customer => {
            const area = customer.area ? customer.area.trim() : 'Unassigned';
            if (!grouped[area]) {
                grouped[area] = [];
            }
            grouped[area].push(customer);
        });
        return grouped;
    }, [assignedCustomers]);

    const paymentsForSalesman = useMemo(() => {
        return salesmanPayments
            .filter(p => {
                const pId = p.salesmanId ? String(p.salesmanId._id || p.salesmanId) : null;
                return pId === salesmanIdStr;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [salesmanPayments, salesmanIdStr]);

    // Salary Logic: Tracks monthly progress against the monthlySalary property
    const salaryStats = useMemo(() => {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        const paidThisMonth = paymentsForSalesman
            .filter(p => {
                if (!p.date) return false;
                const d = new Date(p.date);
                return d.getMonth() === month && d.getFullYear() === year;
            })
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
            
        const baseSalary = Number(salesman.monthlySalary) || 0;
        const balanceThisMonth = Math.max(baseSalary - paidThisMonth, 0);
        const totalPaidAllTime = paymentsForSalesman.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
        
        return { paidThisMonth, balanceThisMonth, totalPaidAllTime };
    }, [paymentsForSalesman, salesman.monthlySalary]);

    const getCustomerName = (customerId) => {
        if (!customerId) return 'Counter Sale';
        const targetId = String(typeof customerId === 'object' ? customerId._id : customerId);
        const customer = customers.find(c => String(c._id || c.id) === targetId);
        return customer ? customer.name : 'Unknown';
    };

    // Performance calculation based on time window
    const performanceStats = useMemo(() => {
        const now = new Date();
        let periodStartDate = new Date();

        switch (performancePeriod) {
            case 'Weekly':
                periodStartDate.setDate(now.getDate() - 7);
                break;
            case 'Monthly':
                periodStartDate.setMonth(now.getMonth() - 1);
                break;
            case 'Yearly':
                periodStartDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                break;
        }

        const salesInPeriod = salesBySalesman.filter(sale => {
            if (!sale.date) return false;
            return new Date(sale.date) >= periodStartDate;
        });
        
        return {
            quantity: salesInPeriod.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0),
            revenue: salesInPeriod.reduce((sum, s) => sum + (Number(s.amount) || 0), 0),
            transactions: salesInPeriod.length,
        };
    }, [salesBySalesman, performancePeriod]);

    // Secondary filter for the sales history table
    const filteredSales = useMemo(() => {
        const sorted = [...salesBySalesman].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (!startDate && !endDate) return sorted;

        return sorted.filter(sale => {
            if (!sale.date) return false;
            const saleDate = sale.date.split('T')[0];
            if (startDate && saleDate < startDate) return false;
            if (endDate && saleDate > endDate) return false;
            return true;
        });
    }, [salesBySalesman, startDate, endDate]);
    
    const periodButtons = ['Weekly', 'Monthly', 'Yearly'];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 border-b border-gray-200 pb-6">
                 <div>
                     <button 
                        onClick={onBack} 
                        className="flex items-center text-sm font-bold text-brand-text-secondary hover:text-brand-blue mb-3 transition-colors"
                    >
                        <ArrowLeftIcon className="h-4 w-4 mr-2" />
                        Back to Team Directory
                    </button>
                    <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">{salesman.name}</h1>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 font-medium">
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md">📞 {salesman.mobile}</span>
                        <span className="bg-gray-100 px-2.5 py-1 rounded-md">🗓 Hired: {salesman.hireDate ? new Date(salesman.hireDate).toLocaleDateString(undefined, {month:'short', year:'numeric'}) : 'N/A'}</span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                    <button
                        onClick={onViewReport}
                        className="w-full sm:w-auto bg-white border border-gray-200 text-brand-text-primary px-5 py-2.5 rounded-lg font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        View Daily Report
                    </button>
                    <button
                        onClick={() => onAddPayment(salesman._id || salesman.id)}
                        className="w-full sm:w-auto flex items-center justify-center bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-lightblue transition-all shadow-md active:scale-95"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Record Salary
                    </button>
                </div>
            </div>
            
            

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard title="Assigned Customers" value={assignedCustomers.length.toString()} icon={<UsersIcon />} color="text-indigo-500" />
                 <StatCard title="Assigned Routes" value={assignedAreas.length.toString()} icon={<TruckIcon />} color="text-blue-500" />
                 <StatCard title="Lifetime Sales" value={totalQuantitySoldAllTime.toLocaleString()} icon={<PackageIcon />} color="text-brand-text-primary" />
                 <StatCard title="Bottles Sold Today" value={Number(salesman.quantitySoldToday || 0).toLocaleString()} icon={<PackageIcon />} color="text-green-500" />
            </div>
            
            {/* Financial Ledger Summary */}
            <div className="bg-white rounded-xl shadow-md p-6 border-2 border-brand-blue/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Salary Ledger</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Base Salary</p>
                        <p className="text-2xl font-black text-brand-text-primary">PKR {Number(salesman.monthlySalary || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                        <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-1">Paid This Month</p>
                        <p className="text-2xl font-black text-green-600">PKR {salaryStats.paidThisMonth.toLocaleString()}</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                        <p className="text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Remaining Balance</p>
                        <p className="text-2xl font-black text-red-600">PKR {salaryStats.balanceThisMonth.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Performance Analytics */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
                    <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Performance Benchmarks</h2>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {periodButtons.map(period => (
                            <button 
                                key={period} 
                                onClick={() => setPerformancePeriod(period)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                                    performancePeriod === period 
                                        ? 'bg-white text-brand-blue shadow-sm' 
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 border border-dashed border-gray-200 rounded-lg">
                        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-2">Items Sold</p>
                        <p className="text-3xl font-black text-indigo-600">{performanceStats.quantity.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 border border-dashed border-gray-200 rounded-lg">
                        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-2">Revenue Generated</p>
                        <p className="text-3xl font-black text-green-600">PKR {performanceStats.revenue.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-4 border border-dashed border-gray-200 rounded-lg">
                        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-2">Total Drops</p>
                        <p className="text-3xl font-black text-brand-blue">{performanceStats.transactions.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Areas Mapping Section */}
            {assignedAreas.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Assigned Territories</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {assignedAreas.map(area => (
                                <div key={area} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow hover:border-brand-blue transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-brand-text-primary truncate pr-2" title={area}>{area}</h3>
                                        <span className="text-[10px] font-black text-brand-blue bg-blue-50 border border-blue-100 px-2 py-1 rounded-md whitespace-nowrap">
                                            {customersByArea[area]?.length || 0} clients
                                        </span>
                                    </div>
                                    {customersByArea[area]?.length > 0 && (
                                        <div className="mt-2 text-[10px] text-gray-500 uppercase font-bold leading-relaxed">
                                            {customersByArea[area].slice(0, 3).map(c => c.name).join(' • ')}
                                            {customersByArea[area].length > 3 && <span className="text-brand-blue ml-1">+{customersByArea[area].length - 3} more</span>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Transactional History Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Sub-ledger */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col xl:flex-row justify-between xl:items-center gap-3">
                        <h2 className="font-black text-brand-text-primary text-lg">Sales Activity</h2>
                        <div className="flex items-center space-x-2 bg-white p-1 rounded border border-gray-200">
                             <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-xs p-1 border-none focus:ring-0 text-brand-blue font-bold cursor-pointer bg-transparent" />
                             <span className="text-gray-300">-</span>
                             <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-xs p-1 border-none focus:ring-0 text-brand-blue font-bold cursor-pointer bg-transparent" />
                        </div>
                    </div>
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-white text-brand-text-secondary uppercase font-bold tracking-wider sticky top-0 shadow-sm z-10 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Customer</th>
                                    <th className="px-5 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSales.length > 0 ? filteredSales.map(sale => (
                                    <tr key={sale._id || sale.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-5 py-3 whitespace-nowrap text-gray-500 font-medium">
                                            {sale.date ? new Date(sale.date).toLocaleDateString(undefined, {month:'short', day:'numeric'}) : 'N/A'}
                                        </td>
                                        <td className="px-5 py-3 font-bold text-brand-text-primary truncate max-w-[150px]" title={getCustomerName(sale.customerId)}>
                                            {getCustomerName(sale.customerId)}
                                        </td>
                                        <td className="px-5 py-3 text-right font-black text-green-600">
                                            {Number(sale.amount || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-10 text-gray-400 italic font-medium">No sales found in this range.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Salary Disbursement History */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="font-black text-brand-text-primary text-lg">Disbursement History</h2>
                    </div>
                    <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-white text-brand-text-secondary uppercase font-bold tracking-wider sticky top-0 shadow-sm z-10 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-3">Date</th>
                                    <th className="px-5 py-3">Amount</th>
                                    <th className="px-5 py-3 text-right">Method</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paymentsForSalesman.length > 0 ? paymentsForSalesman.map(p => (
                                    <tr key={p._id || p.id} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-5 py-3 whitespace-nowrap text-gray-500 font-medium">
                                            {p.date ? new Date(p.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year: 'numeric'}) : 'N/A'}
                                        </td>
                                        <td className="px-5 py-3 font-black text-red-500 whitespace-nowrap">
                                            {Number(p.amount || 0).toLocaleString()}
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                {p.paymentMethod || 'Cash'}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={3} className="text-center py-10 text-gray-400 italic font-medium">No payments have been logged yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesmanDetail;