
// import React, { useState, useMemo } from 'react';
// import { WhatsAppIcon } from '../icons/WhatsAppIcon';
// import { SearchIcon } from '../icons/SearchIcon';

// /**
//  * Component to track and manage customers with unpaid balances.
//  * Features sorting, searching, and quick WhatsApp reminders.
//  * @param {Object} props
//  * @param {Array} props.customers - List of customers with balances.
//  */
// const Outstanding = ({ customers = [] }) => {
//     const [sortKey, setSortKey] = useState('totalBalance');
//     const [sortDirection, setSortDirection] = useState('desc');
//     const [searchTerm, setSearchTerm] = useState('');

//     /**
//      * Opens WhatsApp with a pre-filled debt reminder message.
//      */
//     const openWhatsApp = (mobile, name, balance) => {
//         if(!mobile) {
//             alert("No mobile number on file for this customer.");
//             return;
//         }
//         const message = `Dear ${name}, this is a friendly reminder from Nishat Beverages that your outstanding balance is PKR ${Number(balance).toLocaleString()}. Please arrange payment at your earliest convenience. Thank you!`;
//         const url = `https://wa.me/${mobile.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
//         window.open(url, '_blank', 'noopener,noreferrer');


        
//     };

//     /**
//      * Filters and sorts the customer list based on UI state.
//      */
//     const sortedCustomers = useMemo(() => {
//         // First, filter down to ONLY customers who actually have a balance
//         const withBalance = customers.filter(c => (Number(c.totalBalance) || 0) > 0);

//         const filtered = withBalance.filter(c => {
//             if(!searchTerm) return true;
//             const term = searchTerm.toLowerCase();
//             return (
//                 (c.name || '').toLowerCase().includes(term) ||
//                 (c.address || '').toLowerCase().includes(term) ||
//                 (c.mobile || '').includes(searchTerm)
//             );
//         });

//         return [...filtered].sort((a, b) => {
//             let valA, valB;
//             switch(sortKey) {
//                 case 'name':
//                 case 'address':
//                     valA = (a[sortKey] || '').toLowerCase();
//                     valB = (b[sortKey] || '').toLowerCase();
//                     break;
//                 case 'totalBalance':
//                 default:
//                     valA = Number(a.totalBalance) || 0;
//                     valB = Number(b.totalBalance) || 0;
//                     break;
//             }

//             if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
//             if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
//             return 0;
//         });
//     }, [customers, sortKey, sortDirection, searchTerm]);

//     const handleSort = (key) => {
//         if (sortKey === key) {
//             setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
//         } else {
//             setSortKey(key);
//             setSortDirection(key === 'totalBalance' ? 'desc' : 'asc');
//         }
//     };
    
//     const totalOutstanding = useMemo(() => 
//         customers.reduce((sum, c) => sum + (Number(c.totalBalance) || 0), 0), 
//     [customers]);

//     return (
//         <div className="space-y-6 animate-fade-in">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                  <div>
//                      <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Outstanding Balances</h1>
//                      <p className="text-brand-text-secondary mt-1">Track and collect unpaid accounts from customers.</p>
//                  </div>
//                  <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm flex items-center w-full md:w-auto">
//                      <div className="bg-red-100 p-2 rounded-lg mr-4">
//                          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
//                      </div>
//                      <div>
//                          <span className="text-xs font-bold uppercase tracking-wider text-red-800 block mb-0.5">Total Receivables</span>
//                          <span className="font-black text-2xl text-red-600 leading-none">PKR {totalOutstanding.toLocaleString()}</span>
//                      </div>
//                  </div>
//             </div>

//             <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
//                 <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
//                     <div className="relative w-full sm:w-80">
//                         <input 
//                             type="text"
//                             placeholder="Search debtors..."
//                             value={searchTerm}
//                             onChange={e => setSearchTerm(e.target.value)}
//                             className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm"
//                         />
//                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                             <SearchIcon className="h-5 w-5 text-gray-400" />
//                         </div>
//                     </div>
//                     <span className="text-sm font-bold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
//                         {sortedCustomers.length} accounts found
//                     </span>
//                 </div>
                
//                 <div className="overflow-x-auto min-h-[400px]">
//                     <table className="w-full text-sm text-left text-brand-text-secondary relative">
//                         <thead className="text-xs text-brand-text-secondary uppercase bg-white font-bold tracking-wider border-b border-gray-200 sticky top-0 shadow-sm z-10">
//                             <tr>
//                                 <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none" onClick={() => handleSort('name')}>
//                                     <div className="flex items-center">
//                                         Customer Name 
//                                         {sortKey === 'name' && <span className="ml-1 text-brand-blue">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
//                                     </div>
//                                 </th>
//                                 <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none" onClick={() => handleSort('address')}>
//                                     <div className="flex items-center">
//                                         Address
//                                         {sortKey === 'address' && <span className="ml-1 text-brand-blue">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
//                                     </div>
//                                 </th>
//                                 <th scope="col" className="px-6 py-4">Mobile</th>
//                                 <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors text-right select-none" onClick={() => handleSort('totalBalance')}>
//                                      <div className="flex items-center justify-end">
//                                         Balance (PKR)
//                                         {sortKey === 'totalBalance' && <span className="ml-1 text-red-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
//                                     </div>
//                                 </th>
//                                 <th scope="col" className="px-6 py-4 text-center">Quick Action</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {sortedCustomers.length > 0 ? sortedCustomers.map(customer => (
//                                 <tr key={customer._id || customer.id} className="bg-white hover:bg-red-50/30 transition-colors group">
//                                     <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">{customer.name}</td>
//                                     <td className="px-6 py-4 truncate max-w-[200px]" title={customer.address}>{customer.address}</td>
//                                     <td className="px-6 py-4 font-medium whitespace-nowrap">{customer.mobile}</td>
//                                     <td className="px-6 py-4 text-right font-black text-red-600 whitespace-nowrap text-base">
//                                         {Number(customer.totalBalance || 0).toLocaleString()}
//                                     </td>
//                                     <td className="px-6 py-4 text-center">
//                                         <button 
//                                             onClick={() => openWhatsApp(customer.mobile, customer.name, customer.totalBalance)}
//                                             className="inline-flex items-center justify-center bg-[#25D366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#128C7E] transition-all shadow-sm active:scale-95 whitespace-nowrap opacity-90 hover:opacity-100"
//                                         >
//                                             <WhatsAppIcon className="h-4 w-4 mr-1.5" />
//                                             Send Reminder
//                                         </button>
//                                     </td>
//                                 </tr>
//                             )) : (
//                                 <tr>
//                                     <td colSpan={5} className="text-center py-20 px-6">
//                                         <div className="flex justify-center mb-4 text-green-500">
//                                             <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
//                                         </div>
//                                         <p className="text-brand-text-primary font-bold text-xl">All accounts settled!</p>
//                                         <p className="text-brand-text-secondary mt-1">No customers currently have an outstanding balance matching your search.</p>
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

// export default Outstanding;



import React, { useState, useMemo } from 'react';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { SearchIcon } from '../icons/SearchIcon';
import toast from 'react-hot-toast';

/**
 * Component to track and manage customers with unpaid balances.
 * Features sorting, searching, and quick WhatsApp reminders.
 * @param {Object} props
 * @param {Array} props.customers - List of customers with balances.
 */
const Outstanding = ({ customers = [] }) => {
    const [sortKey, setSortKey] = useState('totalBalance');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');

    /**
     * Opens WhatsApp with a beautifully formatted, detailed debt reminder.
     * Safely formats Pakistani phone numbers.
     */
    const openWhatsApp = (customer) => {
        if (!customer.mobile) {
            toast.error("No mobile number on file for this customer.");
            return;
        }

        // 1. Build the beautifully formatted, detailed message
        const message = `*Nishat Beverages - Payment Reminder*\n\n` +
                        `Dear *${customer.name}*,\n\n` +
                        `This is a friendly reminder regarding your account. Here is your detailed summary as of today (${new Date().toLocaleDateString()}):\n\n` +
                        `-----------------------------------\n` +
                        `🧾 *Total Outstanding Balance:* PKR ${Number(customer.totalBalance).toLocaleString()}\n` +
                        `🔄 *Empty Bottles Held:* ${Number(customer.emptyBottlesHeld || 0)}\n` +
                        `📍 *Delivery Area:* ${customer.area || 'N/A'}\n` +
                        `-----------------------------------\n\n` +
                        `Please arrange payment at your earliest convenience to maintain uninterrupted service. \n\n` +
                        `If you have recently cleared your balance, kindly ignore this message.\n\n` +
                        `Thank you for your business!\n*Nishat Beverages*`;

        // 2. Safely format the phone number (converts 03xx to 923xx)
        let cleanNumber = customer.mobile.replace(/\D/g, '');
        if (cleanNumber.startsWith('0')) {
            cleanNumber = '92' + cleanNumber.substring(1);
        } else if (cleanNumber.length === 10) {
            cleanNumber = '92' + cleanNumber;
        }

        // 3. Open WhatsApp
        if (cleanNumber) {
            const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            toast.error("Invalid mobile number format.");
        }
    };

    /**
     * Filters and sorts the customer list based on UI state.
     */
    const sortedCustomers = useMemo(() => {
        // First, filter down to ONLY customers who actually have a balance
        const withBalance = customers.filter(c => (Number(c.totalBalance) || 0) > 0);

        const filtered = withBalance.filter(c => {
            if(!searchTerm) return true;
            const term = searchTerm.toLowerCase();
            return (
                (c.name || '').toLowerCase().includes(term) ||
                (c.address || '').toLowerCase().includes(term) ||
                (c.mobile || '').includes(searchTerm)
            );
        });

        return [...filtered].sort((a, b) => {
            let valA, valB;
            switch(sortKey) {
                case 'name':
                case 'address':
                    valA = (a[sortKey] || '').toLowerCase();
                    valB = (b[sortKey] || '').toLowerCase();
                    break;
                case 'totalBalance':
                default:
                    valA = Number(a.totalBalance) || 0;
                    valB = Number(b.totalBalance) || 0;
                    break;
            }

            if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
            if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });
    }, [customers, sortKey, sortDirection, searchTerm]);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection(key === 'totalBalance' ? 'desc' : 'asc');
        }
    };
    
    const totalOutstanding = useMemo(() => 
        customers.reduce((sum, c) => sum + (Number(c.totalBalance) || 0), 0), 
    [customers]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                 <div>
                     <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Outstanding Balances</h1>
                     <p className="text-brand-text-secondary mt-1">Track and collect unpaid accounts from customers.</p>
                 </div>
                 <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm flex items-center w-full md:w-auto">
                     <div className="bg-red-100 p-2 rounded-lg mr-4">
                         <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     </div>
                     <div>
                         <span className="text-xs font-bold uppercase tracking-wider text-red-800 block mb-0.5">Total Receivables</span>
                         <span className="font-black text-2xl text-red-600 leading-none">PKR {totalOutstanding.toLocaleString()}</span>
                     </div>
                 </div>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full sm:w-80">
                        <input 
                            type="text"
                            placeholder="Search debtors..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                    <span className="text-sm font-bold text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                        {sortedCustomers.length} accounts found
                    </span>
                </div>
                
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left text-brand-text-secondary relative">
                        <thead className="text-xs text-brand-text-secondary uppercase bg-white font-bold tracking-wider border-b border-gray-200 sticky top-0 shadow-sm z-10">
                            <tr>
                                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none" onClick={() => handleSort('name')}>
                                    <div className="flex items-center">
                                        Customer Name 
                                        {sortKey === 'name' && <span className="ml-1 text-brand-blue">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none" onClick={() => handleSort('address')}>
                                    <div className="flex items-center">
                                        Address
                                        {sortKey === 'address' && <span className="ml-1 text-brand-blue">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4">Mobile</th>
                                <th scope="col" className="px-6 py-4 cursor-pointer hover:bg-gray-50 transition-colors text-right select-none" onClick={() => handleSort('totalBalance')}>
                                     <div className="flex items-center justify-end">
                                        Balance (PKR)
                                        {sortKey === 'totalBalance' && <span className="ml-1 text-red-500">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-4 text-center">Quick Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedCustomers.length > 0 ? sortedCustomers.map(customer => (
                                <tr key={customer._id || customer.id} className="bg-white hover:bg-red-50/30 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">{customer.name}</td>
                                    <td className="px-6 py-4 truncate max-w-[200px]" title={customer.address}>{customer.address}</td>
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{customer.mobile}</td>
                                    <td className="px-6 py-4 text-right font-black text-red-600 whitespace-nowrap text-base">
                                        {Number(customer.totalBalance || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button 
                                            onClick={() => openWhatsApp(customer)}
                                            className="inline-flex items-center justify-center bg-[#25D366] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#128C7E] transition-all shadow-sm active:scale-95 whitespace-nowrap opacity-90 hover:opacity-100"
                                        >
                                            <WhatsAppIcon className="h-4 w-4 mr-1.5" />
                                            Send Reminder
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-20 px-6">
                                        <div className="flex justify-center mb-4 text-green-500">
                                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        </div>
                                        <p className="text-brand-text-primary font-bold text-xl">All accounts settled!</p>
                                        <p className="text-brand-text-secondary mt-1">No customers currently have an outstanding balance matching your search.</p>
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

export default Outstanding;