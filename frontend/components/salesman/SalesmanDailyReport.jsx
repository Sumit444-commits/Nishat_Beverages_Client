// import React, { useMemo, useState } from 'react';
// import { PrinterIcon } from '../icons';

// /**
//  * Generates a printable daily performance report and pay slip for a salesman.
//  * @param {Object} props
//  * @param {Object} props.salesman - The salesman data object.
//  * @param {Array} props.customers - Global list of customers.
//  * @param {Array} props.sales - Global list of sales.
//  * @param {Function} props.onBack - Callback to return to the previous view.
//  */
// const SalesmanDailyReport = ({ salesman, customers, sales, onBack }) => {
//     const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

//     // Processes sales and customer data for the selected date
//     const dailyData = useMemo(() => {
//         const salesmanSalesToday = sales.filter(s => 
//             s.salesmanId === salesman.id && 
//             new Date(s.date).toISOString().split('T')[0] === reportDate
//         );

//         const assignedCustomers = customers.filter(c => c.salesmanId === salesman.id);

//         const salesDetails = salesmanSalesToday.map(sale => ({
//             customerName: customers.find(c => c.id === sale.customerId)?.name || 'Unknown',
//             amount: sale.amount
//         }));

//         const paymentHistory = salesmanSalesToday
//             .filter(sale => sale.amountReceived > 0)
//             .map(sale => ({
//                 date: sale.date,
//                 customerName: customers.find(c => c.id === sale.customerId)?.name || 'Unknown',
//                 amount: sale.amountReceived,
//                 type: sale.paymentMethod
//             }));
            
//         return {
//             bottlesSold: salesmanSalesToday.reduce((sum, s) => sum + s.quantity, 0),
//             revenue: salesmanSalesToday.reduce((sum, s) => sum + s.amount, 0),
//             collected: salesmanSalesToday.reduce((sum, s) => sum + s.amountReceived, 0),
//             assignedCustomers,
//             salesDetails,
//             paymentHistory
//         };
//     }, [salesman, customers, sales, reportDate]);

//     const handlePrint = () => {
//         window.print();
//     };

//     return (
//         <div className="space-y-6">
//              <div className="flex justify-between items-center mb-4 print:hidden">
//                 <div>
//                     <h1 className="text-2xl font-bold text-brand-text-primary">Salesman Daily Report</h1>
//                     <p className="text-brand-text-secondary">
//                         Report for {salesman.name} on {new Date(reportDate).toLocaleDateString()}
//                     </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                      <input
//                         type="date"
//                         value={reportDate}
//                         onChange={e => setReportDate(e.target.value)}
//                         className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                     />
//                     <button onClick={onBack} className="bg-white border border-gray-300 text-brand-text-secondary px-4 py-2 rounded-lg font-semibold hover:bg-gray-50">
//                         &larr; Back to List
//                     </button>
//                     <button onClick={handlePrint} className="bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue flex items-center">
//                         <PrinterIcon className="h-4 w-4 mr-2" /> Print Pay Slip
//                     </button>
//                 </div>
//             </div>

//             <div className="bg-brand-surface p-8 rounded-xl shadow-md">
//                 {/* Report Branding Header */}
//                 <div className="text-center mb-8">
//                     <h2 className="text-2xl font-bold text-brand-text-primary">Salesman Pay Slip & Report</h2>
//                     <p className="text-brand-text-secondary">Nishat Beverages</p>
//                 </div>

//                 {/* Salesman and Date Context */}
//                 <div className="flex justify-between items-start mb-8 pb-4 border-b">
//                     <div>
//                         <p className="text-sm text-brand-text-secondary">Salesman Name:</p>
//                         <p className="font-bold text-lg text-brand-text-primary">{salesman.name}</p>
//                     </div>
//                      <div>
//                         <p className="text-sm text-brand-text-secondary text-right">Date:</p>
//                         <p className="font-bold text-lg text-brand-text-primary">
//                             {new Date(reportDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
//                         </p>
//                     </div>
//                 </div>

//                 {/* Financial Statistics */}
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center">
//                     <div>
//                         <p className="text-sm text-brand-text-secondary">Today's Bottles Sold</p>
//                         <p className="text-2xl font-bold text-brand-text-primary">{dailyData.bottlesSold}</p>
//                         <p className="text-sm text-blue-600 font-semibold mt-2">Salary Balance</p>
//                         <p className="text-sm text-blue-600 font-semibold">PKR {salesman.monthlySalary.toLocaleString()}</p>
//                     </div>
//                      <div>
//                         <p className="text-sm text-brand-text-secondary">Today's Revenue</p>
//                         <p className="text-2xl font-bold text-green-600">PKR {dailyData.revenue.toLocaleString()}</p>
//                     </div>
//                      <div>
//                         <p className="text-sm text-brand-text-secondary">Total Collected</p>
//                         <p className="text-2xl font-bold text-red-600">PKR {dailyData.collected.toLocaleString()}</p>
//                     </div>
//                      <div>
//                         <p className="text-sm text-brand-text-secondary">Monthly Salary</p>
//                         <p className="text-2xl font-bold text-brand-text-primary">PKR {salesman.monthlySalary.toLocaleString()}</p>
//                     </div>
//                 </div>
                
//                 {/* Logistics Section */}
//                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
//                     <h3 className="text-lg font-bold text-brand-text-primary mb-2">Assigned Customers for Delivery</h3>
//                      <table className="w-full text-sm text-left">
//                         <thead className="text-xs text-brand-text-secondary uppercase">
//                             <tr>
//                                 <th className="py-2 px-4">Customer</th>
//                                 <th className="py-2 px-4">Address</th>
//                                 <th className="py-2 px-4">Contact</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                              {dailyData.assignedCustomers.length > 0 ? dailyData.assignedCustomers.map(c => (
//                                 <tr key={c.id} className="border-t">
//                                     <td className="py-2 px-4 font-medium">{c.name}</td>
//                                     <td className="py-2 px-4">{c.address}</td>
//                                     <td className="py-2 px-4">{c.mobile}</td>
//                                 </tr>
//                             )) : (
//                                 <tr>
//                                     <td colSpan={3} className="text-center py-4 text-brand-text-secondary">
//                                         No customers are assigned to this salesman.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Ledger Breakdown */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h3 className="text-lg font-bold text-brand-text-primary mb-2">Sales Details for Today</h3>
//                         <table className="w-full text-sm">
//                              <thead className="text-xs text-brand-text-secondary uppercase">
//                                 <tr>
//                                     <th className="py-2 px-4 text-left">Customer</th>
//                                     <th className="py-2 px-4 text-right">Amount (PKR)</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {dailyData.salesDetails.length > 0 ? dailyData.salesDetails.map((s, i) => (
//                                     <tr key={i} className="border-t">
//                                         <td className="py-2 px-4">{s.customerName}</td>
//                                         <td className="py-2 px-4 text-right font-semibold">{s.amount.toLocaleString()}</td>
//                                     </tr>
//                                 )) : (
//                                     <tr>
//                                         <td colSpan={2} className="text-center py-4 text-brand-text-secondary">
//                                             No sales recorded for today.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                     <div className="bg-gray-50 p-4 rounded-lg">
//                         <h3 className="text-lg font-bold text-brand-text-primary mb-2">Payment History</h3>
//                          <table className="w-full text-sm">
//                              <thead className="text-xs text-brand-text-secondary uppercase">
//                                 <tr>
//                                     <th className="py-2 px-4 text-left">Time</th>
//                                     <th className="py-2 px-4 text-right">Amount (PKR)</th>
//                                     <th className="py-2 px-4 text-right">Method</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                {dailyData.paymentHistory.length > 0 ? dailyData.paymentHistory.map((p, i) => (
//                                     <tr key={i} className="border-t">
//                                         <td className="py-2 px-4">{new Date(p.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
//                                         <td className="py-2 px-4 text-right font-semibold">{p.amount.toLocaleString()}</td>
//                                         <td className="py-2 px-4 text-right">{p.type}</td>
//                                     </tr>
//                                 )) : (
//                                      <tr>
//                                         <td colSpan={3} className="text-center py-4 text-brand-text-secondary">
//                                             No collection history found.
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default SalesmanDailyReport;

import React, { useMemo, useState } from 'react';
import { PrinterIcon } from '../icons';

/**
 * Generates a printable daily performance report and pay slip for a salesman.
 * @param {Object} props
 * @param {Object} props.salesman - The salesman data object.
 * @param {Array} props.customers - Global list of customers.
 * @param {Array} props.sales - Global list of sales.
 * @param {Function} props.onBack - Callback to return to the previous view.
 */
const SalesmanDailyReport = ({ salesman, customers, sales, onBack }) => {
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);

    // Processes sales and customer data for the selected date
    const dailyData = useMemo(() => {
        // Extract correct ID whether it's from MongoDB (_id) or local state (id)
        const targetSalesmanId = String(salesman._id || salesman.id);

        const salesmanSalesToday = sales.filter(s => {
            const saleSalesmanId = String(s.salesmanId?._id || s.salesmanId);
            const saleDateStr = s.date ? new Date(s.date).toISOString().split('T')[0] : '';
            return saleSalesmanId === targetSalesmanId && saleDateStr === reportDate;
        });

        const assignedCustomers = customers.filter(c => {
            const custSalesmanId = String(c.salesmanId?._id || c.salesmanId);
            return custSalesmanId === targetSalesmanId;
        });

        const salesDetails = salesmanSalesToday.map(sale => {
            const customerId = String(sale.customerId?._id || sale.customerId);
            const customer = customers.find(c => String(c._id || c.id) === customerId);
            return {
                customerName: customer ? customer.name : 'Unknown',
                amount: sale.amount || 0
            };
        });

        const paymentHistory = salesmanSalesToday
            .filter(sale => sale.amountReceived > 0)
            .map(sale => {
                const customerId = String(sale.customerId?._id || sale.customerId);
                const customer = customers.find(c => String(c._id || c.id) === customerId);
                return {
                    date: sale.date,
                    customerName: customer ? customer.name : 'Unknown',
                    amount: sale.amountReceived || 0,
                    type: sale.paymentMethod || 'Cash'
                };
            });
            
        return {
            bottlesSold: salesmanSalesToday.reduce((sum, s) => sum + (s.quantity || 0), 0),
            revenue: salesmanSalesToday.reduce((sum, s) => sum + (s.amount || 0), 0),
            collected: salesmanSalesToday.reduce((sum, s) => sum + (s.amountReceived || 0), 0),
            assignedCustomers,
            salesDetails,
            paymentHistory
        };
    }, [salesman, customers, sales, reportDate]);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="flex justify-between items-center mb-4 print:hidden">
                <div>
                    <h1 className="text-2xl font-bold text-brand-text-primary">Salesman Daily Report</h1>
                    <p className="text-brand-text-secondary mt-1">
                        Report for <span className="font-bold">{salesman.name}</span> on {new Date(reportDate).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                     <input
                        type="date"
                        value={reportDate}
                        onChange={e => setReportDate(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                    />
                    <button 
                        onClick={onBack} 
                        className="bg-white border border-gray-300 text-brand-text-secondary px-4 py-2 rounded-lg font-bold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        &larr; Back to List
                    </button>
                    <button 
                        onClick={handlePrint} 
                        className="bg-brand-blue text-white px-5 py-2 rounded-lg font-bold hover:bg-brand-lightblue flex items-center shadow-md transition-all active:scale-95"
                    >
                        <PrinterIcon className="h-5 w-5 mr-2" /> Print Pay Slip
                    </button>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md print:shadow-none print:p-0 border border-gray-100">
                {/* Report Branding Header */}
                <div className="text-center mb-8 border-b pb-6 print:border-black print:pb-4">
                    <h2 className="text-3xl font-black text-brand-text-primary tracking-tight">Salesman Pay Slip & Report</h2>
                    <p className="text-brand-text-secondary font-medium mt-1 uppercase tracking-widest text-sm">Nishat Beverages</p>
                </div>
                
                

                {/* Salesman and Date Context */}
                <div className="flex justify-between items-start mb-8 pb-6 border-b print:border-gray-400">
                    <div>
                        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Salesman Name:</p>
                        <p className="font-black text-2xl text-brand-blue">{salesman.name}</p>
                        <p className="text-sm text-gray-500 font-medium mt-1">{salesman.mobile}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Date:</p>
                        <p className="font-bold text-xl text-brand-text-primary">
                            {new Date(reportDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                {/* Financial Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 text-center print:gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg print:border print:border-gray-300 print:bg-transparent">
                        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-2">Today's Bottles</p>
                        <p className="text-3xl font-black text-brand-text-primary">{dailyData.bottlesSold}</p>
                    </div>
                     <div className="bg-green-50 p-4 rounded-lg print:border print:border-gray-300 print:bg-transparent">
                        <p className="text-xs font-bold text-green-800 uppercase tracking-wider mb-2">Today's Revenue</p>
                        <p className="text-2xl font-black text-green-600">PKR {dailyData.revenue.toLocaleString()}</p>
                    </div>
                     <div className="bg-blue-50 p-4 rounded-lg print:border print:border-gray-300 print:bg-transparent">
                        <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">Total Collected</p>
                        <p className="text-2xl font-black text-blue-600">PKR {dailyData.collected.toLocaleString()}</p>
                    </div>
                     <div className="bg-gray-50 p-4 rounded-lg print:border print:border-gray-300 print:bg-transparent">
                        <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-2">Monthly Salary Base</p>
                        <p className="text-2xl font-black text-brand-text-primary">PKR {(salesman.monthlySalary || 0).toLocaleString()}</p>
                    </div>
                </div>
                
                {/* Logistics Section */}
                 <div className="mb-8">
                    <h3 className="text-lg font-black text-brand-text-primary mb-3 border-b-2 border-gray-100 pb-2 inline-block">Assigned Customers on Route</h3>
                     <table className="w-full text-sm text-left border border-gray-200 rounded-lg overflow-hidden print:border-black">
                        <thead className="bg-gray-50 text-xs text-brand-text-secondary uppercase font-bold print:bg-transparent print:border-b print:border-black">
                            <tr>
                                <th className="py-3 px-4 border-b border-gray-200">Customer Name</th>
                                <th className="py-3 px-4 border-b border-gray-200">Address</th>
                                <th className="py-3 px-4 border-b border-gray-200">Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                             {dailyData.assignedCustomers.length > 0 ? dailyData.assignedCustomers.map(c => (
                                <tr key={c._id || c.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 print:border-b print:border-gray-300">
                                    <td className="py-3 px-4 font-bold text-brand-text-primary">{c.name}</td>
                                    <td className="py-3 px-4 text-brand-text-secondary">{c.address}</td>
                                    <td className="py-3 px-4 text-brand-text-secondary font-medium">{c.mobile}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-6 text-brand-text-secondary italic">
                                        No customers are currently assigned to this salesman.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Ledger Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:space-y-8">
                    <div>
                        <h3 className="text-lg font-black text-brand-text-primary mb-3 border-b-2 border-gray-100 pb-2 inline-block">Sales Details for Today</h3>
                        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden print:border-black">
                             <thead className="bg-gray-50 text-xs text-brand-text-secondary uppercase font-bold print:bg-transparent print:border-b print:border-black">
                                <tr>
                                    <th className="py-3 px-4 text-left border-b border-gray-200">Customer</th>
                                    <th className="py-3 px-4 text-right border-b border-gray-200">Bill Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyData.salesDetails.length > 0 ? dailyData.salesDetails.map((s, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 print:border-b print:border-gray-300">
                                        <td className="py-3 px-4 font-medium">{s.customerName}</td>
                                        <td className="py-3 px-4 text-right font-black text-brand-text-primary">PKR {s.amount.toLocaleString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={2} className="text-center py-6 text-brand-text-secondary italic">
                                            No sales recorded for today.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-black text-brand-text-primary mb-3 border-b-2 border-gray-100 pb-2 inline-block">Payment Collection History</h3>
                         <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden print:border-black">
                             <thead className="bg-gray-50 text-xs text-brand-text-secondary uppercase font-bold print:bg-transparent print:border-b print:border-black">
                                <tr>
                                    <th className="py-3 px-4 text-left border-b border-gray-200">Time</th>
                                    <th className="py-3 px-4 text-right border-b border-gray-200">Amount Collected</th>
                                    <th className="py-3 px-4 text-right border-b border-gray-200">Method</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dailyData.paymentHistory.length > 0 ? dailyData.paymentHistory.map((p, i) => (
                                    <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 print:border-b print:border-gray-300">
                                        <td className="py-3 px-4 text-brand-text-secondary">{new Date(p.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                        <td className="py-3 px-4 text-right font-black text-green-600">PKR {p.amount.toLocaleString()}</td>
                                        <td className="py-3 px-4 text-right text-xs font-bold text-gray-500 uppercase">{p.type}</td>
                                    </tr>
                                )) : (
                                     <tr>
                                        <td colSpan={3} className="text-center py-6 text-brand-text-secondary italic">
                                            No collection history found for today.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t-2 border-dashed border-gray-300 text-center print:block hidden">
                    <p className="text-xs text-gray-500 uppercase tracking-widest">Authorized Signature</p>
                    <div className="mt-8 w-48 h-px bg-black mx-auto"></div>
                </div>
            </div>
        </div>
    );
};

export default SalesmanDailyReport;