import React from 'react';
import CustomerAccountCard from './CustomerAccountCard';

/**
 * Grid layout for customer account cards.
 * @param {Object} props
 * @param {Array} props.customers - Filtered list of customers to display.
 * @param {Array} props.sales - Global sales list passed to children for calculations.
 * @param {Function} props.onAddSale - Action to record a new sale.
 * @param {Function} props.onViewDetails - Action to view profile.
 * @param {Function} props.onEditCustomer - Action to modify info.
 * @param {Function} props.onDeleteCustomer - Action to remove account.
 * @param {Function} props.onCollectEmpties - Action to record bottle returns.
 */
const CustomerAccounts = ({ 
    customers = [], 
    ...otherProps 
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {customers.map((customer, index) => (
                <CustomerAccountCard 
                    key={customer._id || customer.id} // MongoDB ID support
                    customer={customer}
                    index={index}
                    // Pass all other functions (onAddSale, etc.) and sales list down
                    {...otherProps}
                />
            ))}
            
            {customers.length === 0 && (
                <div className="col-span-full text-center py-10 px-6 text-brand-text-secondary bg-brand-surface rounded-xl shadow-md border border-gray-100">
                    <p className="text-lg font-medium">No customers found matching your filters.</p>
                </div>
            )}
        </div>
    );
};

export default CustomerAccounts;