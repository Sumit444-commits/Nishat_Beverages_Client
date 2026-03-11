// import React, { useState, useMemo } from 'react';
// import { WhatsAppIcon } from '../icons/WhatsAppIcon';

// /**
//  * Component for generating and sending daily transaction summaries to customers via WhatsApp.
//  * @param {Object} props
//  * @param {Array} props.customers - List of customers.
//  * @param {Array} props.sales - List of sales transactions.
//  * @param {Function} props.onSendReminder - Callback function to trigger the reminder dispatch.
//  */
// const DailyReminders = ({ customers, sales, onSendReminder }) => {
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//     // Generate summaries for customers who had activity on the selected date
//     const dailySummaries = useMemo(() => {
//         const summaries = [];

//         for (const customer of customers) {
//             // Filter sales specifically for this customer and the selected date
//             const todaySales = sales.filter(s =>
//                 s.customerId === customer.id &&
//                 new Date(s.date).toISOString().split('T')[0] === selectedDate
//             );

//             if (todaySales.length > 0) {
//                  const totalSaleAmount = todaySales.reduce((sum, s) => sum + s.amount, 0);
//                  const paidAmount = todaySales.reduce((sum, s) => sum + s.amountReceived, 0);
//                  const unpaidAmount = totalSaleAmount - paidAmount;
                 
//                  // Calculate balance prior to today's activity
//                  const previousBalance = (customer.totalBalance || 0) - unpaidAmount;
//                  const bottlesPurchased = todaySales.reduce((sum, s) => sum + s.quantity, 0);

//                  summaries.push({
//                      customerId: customer.id,
//                      customerName: customer.name,
//                      customerMobile: customer.mobile,
//                      date: selectedDate,
//                      bottlesPurchased,
//                      totalSaleAmount,
//                      paidAmount,
//                      unpaidAmount,
//                      previousBalance,
//                      closingBalance: customer.totalBalance,
//                      remainingEmpties: customer.emptyBottlesHeld,
//                  });
//             }
//         }
//         return summaries.sort((a, b) => a.customerName.localeCompare(b.customerName));
//     }, [selectedDate, customers, sales]);

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                  <h1 className="text-3xl font-bold text-brand-text-primary">Daily Customer Reminders</h1>
//                  <input
//                     type="date"
//                     value={selectedDate}
//                     onChange={e => setSelectedDate(e.target.value)}
//                     className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                 />
//             </div>

            

//             {dailySummaries.length > 0 ? (
//                 <div className="space-y-4">
//                     {dailySummaries.map(summary => (
//                         <div key={summary.customerId} className="bg-brand-surface rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                             <div className="flex-1">
//                                 <h3 className="font-bold text-lg text-brand-text-primary">{summary.customerName}</h3>
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 mt-2 text-sm">
//                                     <p>
//                                         <span className="font-semibold text-brand-text-secondary">Prev Balance:</span> {summary.previousBalance.toLocaleString()}
//                                     </p>
//                                     <p>
//                                         <span className="font-semibold text-brand-text-secondary">Today's Sales:</span> {summary.totalSaleAmount.toLocaleString()}
//                                     </p>
//                                     <p>
//                                         <span className="font-semibold text-brand-text-secondary">Today's Paid:</span> {summary.paidAmount.toLocaleString()}
//                                     </p>
//                                     <p>
//                                         <span className="font-semibold text-brand-text-secondary text-yellow-600">Today's Unpaid:</span> {summary.unpaidAmount.toLocaleString()}
//                                     </p>
//                                     <p className="font-bold">
//                                         <span className="font-semibold text-brand-text-secondary">Closing Balance:</span> {summary.closingBalance.toLocaleString()}
//                                     </p>
//                                     <p>
//                                         <span className="font-semibold text-brand-text-secondary">Bottles Today:</span> {summary.bottlesPurchased}
//                                     </p>
//                                     <p>
//                                         <span className="font-semibold text-brand-text-secondary text-red-600">Empties Held:</span> {summary.remainingEmpties}
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="flex-shrink-0 w-full md:w-auto">
//                                 <button
//                                     onClick={() => onSendReminder(summary)}
//                                     className="w-full flex items-center justify-center bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-sm"
//                                 >
//                                     <WhatsAppIcon className="h-5 w-5 mr-2" />
//                                     Send Reminder
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="text-center py-16 px-6 bg-brand-surface rounded-xl shadow-md border border-dashed border-gray-300">
//                     <p className="text-brand-text-secondary">
//                         No customer sales were recorded on {new Date(selectedDate).toLocaleDateString()}.
//                     </p>
//                     <p className="text-sm text-gray-400 mt-2">
//                         Change the date to view summaries for other days.
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default DailyReminders;


import React, { useState, useMemo } from 'react';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';

/**
 * Component for generating and sending daily transaction summaries to customers via WhatsApp.
 * @param {Object} props
 * @param {Array} props.customers - List of customers from MongoDB.
 * @param {Array} props.sales - List of sales transactions.
 * @param {Function} props.onSendReminder - Callback function to trigger the reminder dispatch.
 */
const DailyReminders = ({ customers = [], sales = [], onSendReminder }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    // Generate summaries for customers who had activity on the selected date
    const dailySummaries = useMemo(() => {
        const summaries = [];

        for (const customer of customers) {
            const customerIdStr = String(customer._id || customer.id);
            
            // Filter sales specifically for this customer and the selected date
            const todaySales = sales.filter(s => {
                if (!s.date) return false;
                const saleCustId = String(s.customerId?._id || s.customerId);
                return saleCustId === customerIdStr && new Date(s.date).toISOString().split('T')[0] === selectedDate;
            });

            if (todaySales.length > 0) {
                 const totalSaleAmount = todaySales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
                 const paidAmount = todaySales.reduce((sum, s) => sum + (Number(s.amountReceived) || 0), 0);
                 const unpaidAmount = totalSaleAmount - paidAmount;
                 
                 // Calculate balance prior to today's activity
                 const previousBalance = (Number(customer.totalBalance) || 0) - unpaidAmount;
                 const bottlesPurchased = todaySales.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);

                 summaries.push({
                     customerId: customerIdStr,
                     customerName: customer.name,
                     customerMobile: customer.mobile,
                     date: selectedDate,
                     bottlesPurchased,
                     totalSaleAmount,
                     paidAmount,
                     unpaidAmount,
                     previousBalance,
                     closingBalance: Number(customer.totalBalance) || 0,
                     remainingEmpties: Number(customer.emptyBottlesHeld) || 0,
                 });
            }
        }
        return summaries.sort((a, b) => a.customerName.localeCompare(b.customerName));
    }, [selectedDate, customers, sales]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                     <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Daily Customer Summaries</h1>
                     <p className="text-brand-text-secondary mt-1">Review activity and send automated WhatsApp receipts.</p>
                </div>
                <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm inline-block self-start sm:self-auto">
                     <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="px-4 py-2 bg-transparent focus:outline-none focus:ring-0 text-brand-blue font-bold cursor-pointer transition-all"
                    />
                </div>
            </div>

            

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
                    <p className="text-sm font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Active Customers</p>
                    <p className="text-3xl font-black text-brand-blue">{dailySummaries.length}</p>
                    <p className="text-xs text-gray-500 mt-2 font-medium">Customers with recorded activity today.</p>
                </div>
            </div>

            {dailySummaries.length > 0 ? (
                <div className="space-y-4">
                    {dailySummaries.map(summary => (
                        <div key={summary.customerId} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-md transition-shadow group">
                            <div className="flex-1 w-full">
                                <div className="flex items-center mb-3 border-b border-gray-100 pb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center font-black text-lg mr-3">
                                        {summary.customerName.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg text-brand-text-primary leading-tight">{summary.customerName}</h3>
                                        <p className="text-sm text-gray-500 font-medium">{summary.customerMobile}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-4 mt-2 text-sm">
                                    <div className="bg-gray-50 p-2 rounded border border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase">Prev Balance</p>
                                        <p className="font-bold text-gray-700 mt-0.5">{summary.previousBalance.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-blue-50 p-2 rounded border border-blue-100">
                                        <p className="text-xs font-bold text-blue-800 uppercase">Today's Sales</p>
                                        <p className="font-bold text-brand-blue mt-0.5">{summary.totalSaleAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-green-50 p-2 rounded border border-green-100">
                                        <p className="text-xs font-bold text-green-800 uppercase">Paid Today</p>
                                        <p className="font-bold text-green-700 mt-0.5">{summary.paidAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-red-50 p-2 rounded border border-red-100">
                                        <p className="text-xs font-bold text-red-800 uppercase">Added to Ledger</p>
                                        <p className="font-bold text-red-600 mt-0.5">{summary.unpaidAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-4 flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                                        <div className="flex space-x-6">
                                            <p>
                                                <span className="font-bold text-brand-text-secondary text-xs uppercase mr-2">Bottles Today:</span> 
                                                <span className="font-black">{summary.bottlesPurchased}</span>
                                            </p>
                                            <p>
                                                <span className="font-bold text-brand-text-secondary text-xs uppercase mr-2">Empties Held:</span> 
                                                <span className="font-black text-orange-600">{summary.remainingEmpties}</span>
                                            </p>
                                        </div>
                                        <p className="text-right">
                                            <span className="font-bold text-brand-text-secondary text-xs uppercase mr-2">Closing Balance:</span> 
                                            <span className={`font-black text-lg ${summary.closingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                {summary.closingBalance.toLocaleString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex-shrink-0 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                                <button
                                    onClick={() => onSendReminder(summary)}
                                    className="w-full lg:w-auto flex items-center justify-center bg-[#25D366] text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#128C7E] transition-all shadow-md active:scale-95 group-hover:shadow-lg"
                                >
                                    <WhatsAppIcon className="h-5 w-5 mr-2" />
                                    Send WhatsApp Receipt
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 px-6 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    <p className="text-xl font-bold text-brand-text-primary">No activity recorded</p>
                    <p className="text-brand-text-secondary mt-2 max-w-md">
                        There are no customer sales or payments logged for <span className="font-bold">{new Date(selectedDate).toLocaleDateString()}</span>.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DailyReminders;