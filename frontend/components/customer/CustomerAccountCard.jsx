

import React from 'react';
import { WhatsAppIcon, EditIcon, TrashIcon } from '../icons';

/**
 * A card component displaying customer account summaries and quick actions.
 * @param {Object} props
 * @param {Object} props.customer - The customer data object from MongoDB.
 * @param {Array} props.sales - List of all sales to calculate total items purchased.
 * @param {number} props.index - The list index for labeling.
 * @param {Function} props.onAddSale - Opens the sale modal.
 * @param {Function} props.onViewDetails - Navigates to detailed view.
 * @param {Function} props.onEditCustomer - Opens the edit modal.
 * @param {Function} props.onDeleteCustomer - Triggers delete confirmation.
 * @param {Function} props.onCollectEmpties - Opens the empty collection modal.
 */
const CustomerAccountCard = ({ 
    customer, 
    sales, 
    index,
    onAddSale, 
    onViewDetails, 
    onEditCustomer, 
    onDeleteCustomer,
    onCollectEmpties
}) => {

    // Safely extract the ID regardless of whether it's the raw MongoDB _id or mapped id
    const customerId = customer._id || customer.id;

    // Calculate total quantity of items purchased by this specific customer
    const totalItemsPurchased = sales
        .filter(s => s.customerId === customerId)
        .reduce((sum, s) => sum + s.quantity, 0);

    const openWhatsApp = (mobile) => {
        // Remove non-numeric characters for the WhatsApp API link
        const url = `https://wa.me/${mobile.replace(/\D/g, '')}`;
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-brand-surface rounded-xl shadow-md p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100 animate-fade-in">
            <div>
                <div className="border-b pb-3 mb-3">
                    <button onClick={() => onViewDetails(customer)} className="w-full text-left focus:outline-none group">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-brand-text-secondary bg-gray-100 px-2 py-0.5 rounded-full group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                #{index + 1}
                            </span>
                            <h3 className="font-bold text-lg text-brand-blue group-hover:underline truncate">
                                {customer.name}
                            </h3>
                        </div>
                    </button>
                    <p className="text-sm text-brand-text-secondary truncate mt-1" title={customer.address}>
                        {customer.address}
                    </p>
                    <p className="text-sm font-medium text-brand-text-secondary mt-0.5">
                        {customer.mobile}
                    </p>
                </div>

                

                <div className="grid grid-cols-3 gap-2 text-center text-sm mb-4 bg-gray-50 p-2 rounded-lg">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-brand-text-secondary">Balance</p>
                        <p className={`font-bold text-lg ${customer.totalBalance > 0 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {customer.totalBalance.toLocaleString()}
                        </p>
                    </div>
                    <div className="border-l border-r border-gray-200">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-brand-text-secondary">Empties</p>
                        <p className={`font-bold text-lg ${customer.emptyBottlesHeld > 5 ? 'text-red-600' : 'text-brand-text-primary'}`}>
                            {customer.emptyBottlesHeld}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-brand-text-secondary">Bought</p>
                        <p className="font-bold text-lg text-brand-text-primary">
                            {totalItemsPurchased}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 border-t border-gray-100">
                <button 
                    onClick={() => onAddSale(customer)} 
                    className="flex-1 text-xs bg-green-500 text-white px-2 py-2 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-sm active:scale-95"
                >
                    Sale
                </button>
                <button 
                    onClick={() => onCollectEmpties(customer)} 
                    className="flex-1 text-xs bg-blue-500 text-white px-2 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-sm active:scale-95"
                >
                    Collect
                </button>
                <button 
                    onClick={() => onViewDetails(customer)} 
                    className="flex-1 text-xs bg-gray-600 text-white px-2 py-2 rounded-lg font-bold hover:bg-gray-700 transition-colors shadow-sm active:scale-95"
                >
                    Details
                </button>
                
                <div className="flex items-center gap-1 ml-1 border-l pl-2">
                    <button 
                        onClick={() => onEditCustomer(customer)} 
                        className="p-1.5 text-brand-blue hover:bg-blue-100 rounded-full transition-colors focus:outline-none"
                        title="Edit Customer"
                    >
                        <EditIcon className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => openWhatsApp(customer.mobile)} 
                        className="p-1.5 text-green-500 hover:bg-green-100 rounded-full transition-colors focus:outline-none"
                        title="WhatsApp"
                    >
                        <WhatsAppIcon className="h-4 w-4" />
                    </button>
                    <button 
                        onClick={() => {
                            if(window.confirm(`Are you sure you want to delete ${customer.name}?`)) {
                                onDeleteCustomer(customerId);
                            }
                        }} 
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded-full transition-colors focus:outline-none"
                        title="Delete Customer"
                    >
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerAccountCard;