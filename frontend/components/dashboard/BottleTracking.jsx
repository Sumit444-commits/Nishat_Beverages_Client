import React from 'react';

const BottleTracking = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Bottle Tracking</h1>
                <p className="text-brand-text-secondary mt-1">Monitor the location and lifecycle of reusable water bottles.</p>
            </div>

            
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center mt-6">
                <div className="text-blue-200 mb-4 flex justify-center">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-brand-text-primary">Feature Coming Soon</h2>
                <p className="text-brand-text-secondary mt-3 max-w-md mx-auto leading-relaxed">
                    The advanced bottle tracking system is currently under development. Soon, you will be able to track individual bottle lifecycles and exact customer holdings in real-time.
                </p>
            </div>
        </div>
    );
};

export default BottleTracking;

// import React, { useState, useMemo } from 'react';
// import { BoxIcon, UsersIcon, AlertTriangleIcon, ArrowLeftIcon } from '../icons';

// /**
//  * Component for monitoring the lifecycle and location of reusable water bottles.
//  * @param {Object} props
//  * @param {Array} props.customers - List of customers with their current bottle balances.
//  * @param {Array} props.sales - History of sales and empties collected.
//  * @param {number} props.totalInventory - Total bottles owned by the plant.
//  */
// const BottleTracking = ({ customers = [], sales = [], totalInventory = 1000 }) => {
//     const [searchTerm, setSearchTerm] = useState('');

//     // Calculate aggregate bottle metrics
//     const stats = useMemo(() => {
//         const bottlesAtCustomers = customers.reduce((sum, c) => sum + (c.bottleBalance || 0), 0);
//         const bottlesInPlant = totalInventory - bottlesAtCustomers;
        
//         // Find customers with high outstanding bottles (potential loss risk)
//         const highRiskCount = customers.filter(c => (c.bottleBalance || 0) > 10).length;

//         return {
//             atCustomers: bottlesAtCustomers,
//             inPlant: bottlesInPlant,
//             riskCount: highRiskCount,
//             utilization: ((bottlesAtCustomers / totalInventory) * 100).toFixed(1)
//         };
//     }, [customers, totalInventory]);

//     // Filter customers for the tracking table
//     const filteredCustomers = useMemo(() => {
//         return customers
//             .filter(c => 
//                 (c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//                  c.address.toLowerCase().includes(searchTerm.toLowerCase())) &&
//                 (c.bottleBalance || 0) !== 0
//             )
//             .sort((a, b) => (b.bottleBalance || 0) - (a.bottleBalance || 0));
//     }, [customers, searchTerm]);

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-brand-text-primary">Bottle Tracking</h1>
//                 <span className="text-sm text-brand-text-secondary bg-gray-100 px-3 py-1 rounded-full font-medium">
//                     Total Fleet: {totalInventory} Units
//                 </span>
//             </div>

//             {/* Summary Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
//                     <div className="flex items-center text-brand-text-secondary mb-2">
//                         <UsersIcon className="h-5 w-5 mr-2" />
//                         <span className="text-sm font-medium">At Customer Sites</span>
//                     </div>
//                     <div className="text-2xl font-bold text-brand-text-primary">{stats.atCustomers}</div>
//                 </div>

//                 <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
//                     <div className="flex items-center text-brand-text-secondary mb-2">
//                         <BoxIcon className="h-5 w-5 mr-2" />
//                         <span className="text-sm font-medium">Available in Plant</span>
//                     </div>
//                     <div className="text-2xl font-bold text-brand-text-primary">{stats.inPlant}</div>
//                 </div>

//                 <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
//                     <div className="flex items-center text-brand-text-secondary mb-2">
//                         <AlertTriangleIcon className="h-5 w-5 mr-2" />
//                         <span className="text-sm font-medium">High Risk Accounts</span>
//                     </div>
//                     <div className="text-2xl font-bold text-brand-text-primary">{stats.riskCount}</div>
//                 </div>

//                 <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
//                     <div className="flex items-center text-brand-text-secondary mb-2">
//                         <span className="text-sm font-medium">Fleet Utilization</span>
//                     </div>
//                     <div className="text-2xl font-bold text-brand-text-primary">{stats.utilization}%</div>
//                 </div>
//             </div>

//             {/* Tracking Table */}
//             <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
//                 <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                     <h2 className="text-xl font-bold text-brand-text-primary">Customer Bottle Ledger</h2>
//                     <input 
//                         type="text"
//                         placeholder="Search by name or area..."
//                         className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue outline-none w-full md:w-64"
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                 </div>

                

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left">
//                         <thead className="bg-gray-50 text-brand-text-secondary uppercase text-xs font-semibold">
//                             <tr>
//                                 <th className="px-6 py-4">Customer Name</th>
//                                 <th className="px-6 py-4 text-center">Bottles Held</th>
//                                 <th className="px-6 py-4">Area</th>
//                                 <th className="px-6 py-4 text-right">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {filteredCustomers.length > 0 ? filteredCustomers.map(customer => (
//                                 <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
//                                     <td className="px-6 py-4 font-medium text-brand-text-primary">{customer.name}</td>
//                                     <td className="px-6 py-4 text-center">
//                                         <span className={`inline-block px-3 py-1 rounded-full font-bold ${
//                                             customer.bottleBalance > 10 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
//                                         }`}>
//                                             {customer.bottleBalance || 0}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-brand-text-secondary">{customer.address}</td>
//                                     <td className="px-6 py-4 text-right">
//                                         {customer.bottleBalance > 15 ? (
//                                             <span className="text-red-500 flex items-center justify-end font-medium">
//                                                 <AlertTriangleIcon className="h-4 w-4 mr-1" /> Overdue
//                                             </span>
//                                         ) : (
//                                             <span className="text-green-600 font-medium">Healthy</span>
//                                         )}
//                                     </td>
//                                 </tr>
//                             )) : (
//                                 <tr>
//                                     <td colSpan="4" className="px-6 py-12 text-center text-brand-text-secondary">
//                                         No outstanding bottles found. All fleet accounted for!
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default BottleTracking;