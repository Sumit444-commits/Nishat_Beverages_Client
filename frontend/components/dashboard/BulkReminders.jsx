import React, { useState, useMemo } from 'react';
import { WhatsAppIcon } from '../icons';

const DEFAULT_TEMPLATE = `Dear {customerName},\n\nThis is a friendly reminder from Nishat Beverages that your outstanding balance is PKR {outstandingBalance}.\n\nPlease arrange for payment at your earliest convenience.\n\nThank you!`;

const PLACEHOLDERS = [
    '{customerName}',
    '{outstandingBalance}',
    '{address}',
    '{mobileNumber}',
    '{lastSaleDate}',
];

/**
 * Component for sending bulk WhatsApp/SMS reminders to customers based on balance.
 * @param {Object} props
 * @param {Array} props.customers - List of customer objects from MongoDB.
 * @param {Array} props.sales - History of sales records.
 * @param {Function} props.onSend - Callback handling the actual message dispatch.
 */
const BulkReminders = ({ customers = [], sales = [], onSend }) => {
    const [messageTemplate, setMessageTemplate] = useState(DEFAULT_TEMPLATE);
    const [targetFilter, setTargetFilter] = useState('outstanding');

    // Filter customers based on the selected criteria
    const targetedCustomers = useMemo(() => {
        if (targetFilter === 'all') {
            return customers;
        }
        // Filters for customers with a debt greater than 0
        return customers.filter(c => (Number(c.totalBalance) || 0) > 0);
    }, [customers, targetFilter]);

    const handleSendReminders = () => {
        if (targetedCustomers.length === 0) {
            alert("No customers to send reminders to.");
            return;
        }

        const confirmation = window.confirm(
            `Are you sure you want to queue this reminder for ${targetedCustomers.length} customer(s)?`
        );

        if (confirmation) {
            onSend(targetedCustomers, messageTemplate);
            // Replaced alert with a cleaner confirmation log (or use toast if implemented here)
            console.log(`${targetedCustomers.length} reminders have been queued for sending.`);
        }
    };

    const insertPlaceholder = (placeholder) => {
        setMessageTemplate(prev => prev + placeholder);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Bulk Customer Reminders</h1>
                <p className="text-brand-text-secondary mt-1">Send automated payment reminders to multiple customers at once.</p>
            </div>
            
            

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Configuration Panel */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col h-full">
                    <h2 className="text-xl font-bold text-brand-text-primary border-b border-gray-100 pb-3 mb-4">1. Compose Your Message</h2>
                    
                    <div className="flex-grow flex flex-col space-y-4">
                        <div className="flex-grow flex flex-col">
                            <label htmlFor="message-template" className="block text-sm font-bold text-brand-text-secondary uppercase tracking-wider mb-2">
                                Message Template
                            </label>
                            <textarea
                                id="message-template"
                                rows={10}
                                value={messageTemplate}
                                onChange={(e) => setMessageTemplate(e.target.value)}
                                className="flex-grow block w-full px-4 py-3 border border-gray-300 bg-gray-50 rounded-lg shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm font-mono transition-all resize-none"
                            />
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Click to insert placeholder:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {PLACEHOLDERS.map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => insertPlaceholder(p)} 
                                        className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-bold font-mono rounded-md shadow-sm hover:bg-blue-600 hover:text-white transition-colors active:scale-95"
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Send Panel */}
                <div className="flex flex-col space-y-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex-grow">
                        <h2 className="text-xl font-bold text-brand-text-primary border-b border-gray-100 pb-3 mb-4">2. Select Audience</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-brand-text-secondary uppercase tracking-wider mb-3">Target Filter</label>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                                    <button 
                                        onClick={() => setTargetFilter('outstanding')} 
                                        className={`flex-1 px-4 py-3 text-sm font-bold rounded-lg transition-all border ${
                                            targetFilter === 'outstanding' 
                                                ? 'bg-brand-blue text-white border-brand-blue shadow-md' 
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        Customers with Balance
                                    </button>
                                    <button 
                                        onClick={() => setTargetFilter('all')} 
                                        className={`flex-1 px-4 py-3 text-sm font-bold rounded-lg transition-all border ${
                                            targetFilter === 'all' 
                                                ? 'bg-brand-blue text-white border-brand-blue shadow-md' 
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        All Customers
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex justify-between items-center">
                                <span className="text-sm font-medium text-brand-text-secondary">Recipients found:</span>
                                <span className="text-2xl font-black text-brand-text-primary bg-white px-4 py-1 rounded shadow-sm border border-gray-200">
                                    {targetedCustomers.length}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleSendReminders}
                        disabled={targetedCustomers.length === 0}
                        className="w-full flex items-center justify-center bg-green-500 text-white px-6 py-4 rounded-xl font-black text-lg hover:bg-green-600 transition-all shadow-lg hover:shadow-xl disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none active:scale-95"
                    >
                        <WhatsAppIcon className="h-6 w-6 mr-3" />
                        Send {targetedCustomers.length > 0 ? targetedCustomers.length : ''} WhatsApp Reminders
                    </button>
                </div>
            </div>

            {/* Preview Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                     <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Recipient List Preview</h2>
                </div>
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full text-sm text-left text-brand-text-secondary relative">
                        <thead className="text-xs text-brand-text-secondary uppercase bg-white sticky top-0 shadow-sm z-10 font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4 border-b border-gray-200">Customer Name</th>
                                <th className="px-6 py-4 border-b border-gray-200">Mobile Number</th>
                                <th className="px-6 py-4 text-right border-b border-gray-200">Current Balance (PKR)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                             {targetedCustomers.map(customer => (
                                <tr key={customer._id || customer.id} className="bg-white hover:bg-blue-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">{customer.name}</td>
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{customer.mobile}</td>
                                    <td className="px-6 py-4 text-right font-black text-red-600 whitespace-nowrap">
                                        {Number(customer.totalBalance || 0).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {targetedCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-16">
                                        <div className="text-gray-400 mb-2 flex justify-center">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        </div>
                                        <p className="text-brand-text-secondary font-medium text-lg">No customers match the selected filter.</p>
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

export default BulkReminders;