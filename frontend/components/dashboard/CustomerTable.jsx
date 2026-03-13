
import React from 'react';
import { WhatsAppIcon } from '../icons/WhatsAppIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';
import { BoxIcon } from '../icons/BoxIcon';
import { isDeliveryDue } from '../../utils/delivery-helper';

/**
 * Renders a sortable and actionable table of customers.
 * @param {Object} props
 * @param {Array} props.customers - The list of customer objects from MongoDB to display.
 * @param {Array} props.sales - Global sales history used to calculate delivery status.
 * @param {Function} props.onAddSale - Callback to open the sale modal.
 * @param {Function} props.onViewDetails - Callback to navigate to customer profile.
 * @param {Function} props.onEditCustomer - Callback to open edit modal.
 * @param {Function} props.onDeleteCustomer - Callback to remove a customer record.
 * @param {Function} props.onCollectEmpties - Callback to record bottle returns.
 */
const CustomerTable = ({ 
    customers = [], 
    sales = [], 
    onAddSale, 
    onViewDetails, 
    onEditCustomer, 
    onDeleteCustomer, 
    onCollectEmpties 
}) => {
    
    // Helper to launch WhatsApp Web or App with the customer's number
    const openWhatsApp = (mobile) => {
        if (!mobile) return;
        const url = `https://wa.me/${mobile.replace(/\D/g, '')}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50/80 font-bold tracking-wider border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4">Customer Name</th>
                            <th scope="col" className="px-6 py-4">Address</th>
                            <th scope="col" className="px-6 py-4">Mobile</th>
                            <th scope="col" className="px-6 py-4 text-right">Balance (PKR)</th>
                            <th scope="col" className="px-6 py-4 text-center">Empties Held</th>
                            <th scope="col" className="px-6 py-4 text-center">Delivery Status</th>
                            <th scope="col" className="px-6 py-4 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {customers.map((customer) => {
                            // Calculates if the customer needs water today based on frequency
                            const deliveryDue = isDeliveryDue(customer, sales);
                            
                            return (
                                <tr key={customer._id || customer.id} className="bg-white hover:bg-blue-50/40 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">
                                        <button 
                                            onClick={() => onViewDetails(customer)} 
                                            className="hover:text-brand-blue hover:underline focus:outline-none transition-colors text-left"
                                        >
                                            {customer.name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 truncate max-w-[200px]" title={customer.address}>
                                        {customer.address}
                                    </td>
                                    <td className="px-6 py-4 font-medium">{customer.mobile}</td>
                                    <td className={`px-6 py-4 text-right font-black ${
                                        (Number(customer.totalBalance) || 0) > 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {Number(customer.totalBalance || 0).toLocaleString()}
                                    </td>
                                     <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-md text-xs font-black ${
                                            (Number(customer.emptyBottlesHeld) || 0) > 5 ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {customer.emptyBottlesHeld || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            deliveryDue ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                                        }`}>
                                            {deliveryDue ? 'Due Today' : 'Scheduled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center space-x-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            {/* Primary Business Actions */}
                                            <button
                                                onClick={() => onAddSale(customer)}
                                                title="Record Sale"
                                                className="bg-brand-blue text-white p-1.5 rounded-md hover:bg-brand-lightblue transition-colors shadow-sm active:scale-95"
                                            >
                                                <PlusCircleIcon className="h-4 w-4" />
                                            </button>
                                             <button
                                                onClick={() => onCollectEmpties(customer)}
                                                title="Collect Empties"
                                                className="bg-indigo-500 text-white p-1.5 rounded-md hover:bg-indigo-600 transition-colors shadow-sm active:scale-95"
                                            >
                                                <BoxIcon className="h-4 w-4" />
                                            </button>
                                            
                                            <div className="w-px h-5 bg-gray-200 mx-1"></div>
                                            
                                            {/* Administrative Actions */}
                                            <button 
                                                onClick={() => openWhatsApp(customer.mobile)} 
                                                title="WhatsApp Customer" 
                                                className="text-green-500 hover:text-green-600 hover:bg-green-50 transition-colors p-1.5 rounded-md"
                                            >
                                                <WhatsAppIcon className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => onEditCustomer(customer)} 
                                                title="Edit Customer"
                                                className="text-brand-text-secondary hover:text-brand-blue hover:bg-blue-50 transition-colors p-1.5 rounded-md"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm(`Are you sure you want to delete ${customer.name}? This action is irreversible.`)) {
                                                        onDeleteCustomer(customer._id || customer.id);
                                                    }
                                                }} 
                                                title="Delete Customer" 
                                                className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors p-1.5 rounded-md"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
             {customers.length === 0 && (
                <div className="text-center py-16 px-6">
                    <div className="text-gray-300 mb-3 flex justify-center">
                        <SearchIcon className="h-10 w-10" />
                    </div>
                    <p className="text-brand-text-primary font-bold text-lg">No customers found</p>
                    <p className="text-brand-text-secondary text-sm mt-1">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
};

export default CustomerTable;