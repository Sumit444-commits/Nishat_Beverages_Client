// import React, { useState } from 'react';
// import { EditIcon } from '../icons/EditIcon';
// import { TrashIcon } from '../icons/TrashIcon';

// /**
//  * Component to display a filterable table of daily sales records.
//  * @param {Object} props
//  * @param {Array} props.sales - List of all sale transactions.
//  * @param {Array} props.customers - List of customers for lookup.
//  * @param {Array} props.salesmen - List of salesmen for lookup.
//  * @param {Array} props.inventory - List of inventory items for lookup.
//  * @param {Function} props.onEditSale - Callback to edit a specific sale.
//  * @param {Function} props.onDeleteSale - Callback to delete a specific sale.
//  */
// const DailySales = ({ sales, customers, salesmen, inventory, onEditSale, onDeleteSale }) => {

//     const getCustomerName = (customerId) => {
//         if (customerId === null) return 'Counter Sale';
//         return customers.find(c => c.id === customerId)?.name || 'Unknown Customer';
//     };

//     const getSalesmanName = (salesmanId) => {
//         if (salesmanId === null) return 'N/A';
//         return salesmen.find(s => s.id === salesmanId)?.name || 'Unknown Salesman';
//     };

//     const getItemName = (sale) => {
//         if (sale.description) return sale.description;
//         if (sale.inventoryItemId === null) return 'Payment';
//         return inventory.find(i => i.id === sale.inventoryItemId)?.name || 'Unknown Item';
//     };

//     // Initialize state with today's date in YYYY-MM-DD format
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

//     // Derived state for the table: filtered by date and sorted by time (descending)
//     const filteredSales = sales
//         .filter(s => new Date(s.date).toISOString().split('T')[0] === selectedDate)
//         .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

//     return (
//         <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
//             <div className="p-6 flex justify-between items-center border-b border-gray-200">
//                 <h2 className="text-xl font-bold text-brand-text-primary">Daily Sales Records</h2>
//                 <div className="flex items-center space-x-2">
//                     <label htmlFor="sale-date-filter" className="text-sm text-brand-text-secondary font-medium">Filter Date:</label>
//                     <input
//                         id="sale-date-filter"
//                         type="date"
//                         value={selectedDate}
//                         onChange={e => setSelectedDate(e.target.value)}
//                         className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                     />
//                 </div>
//             </div>

//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm text-left text-brand-text-secondary">
//                     <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
//                         <tr>
//                             <th scope="col" className="px-6 py-3">Date</th>
//                             <th scope="col" className="px-6 py-3">Customer</th>
//                             <th scope="col" className="px-6 py-3">Item Sold</th>
//                             <th scope="col" className="px-6 py-3">Salesman</th>
//                             <th scope="col" className="px-6 py-3">Quantity</th>
//                             <th scope="col" className="px-6 py-3">Amount (PKR)</th>
//                             <th scope="col" className="px-6 py-3">Payment</th>
//                             <th scope="col" className="px-6 py-3">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {filteredSales.length > 0 ? filteredSales.map((sale) => (
//                             <tr key={sale.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
//                                 <td className="px-6 py-4 whitespace-nowrap">{new Date(sale.date).toLocaleDateString()}</td>
//                                 <td className="px-6 py-4 font-medium text-brand-text-primary">{getCustomerName(sale.customerId)}</td>
//                                 <td className="px-6 py-4">{getItemName(sale)}</td>
//                                 <td className="px-6 py-4">{getSalesmanName(sale.salesmanId)}</td>
//                                 <td className="px-6 py-4 text-center">{sale.quantity > 0 ? sale.quantity : '-'}</td>
//                                 <td className="px-6 py-4 font-semibold">{sale.amount.toLocaleString()}</td>
//                                 <td className="px-6 py-4">
//                                     <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
//                                         sale.paymentMethod === 'Cash' ? 'bg-green-100 text-green-800' :
//                                         sale.paymentMethod === 'Bank' ? 'bg-blue-100 text-blue-800' :
//                                         'bg-yellow-100 text-yellow-800'
//                                     }`}>
//                                         {sale.paymentMethod}
//                                     </span>
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     <div className="flex items-center space-x-3">
//                                         <button
//                                             onClick={() => onEditSale(sale)}
//                                             className="text-brand-blue hover:text-brand-accent"
//                                             title="Edit Sale"
//                                         >
//                                             <EditIcon className="h-4 w-4" />
//                                         </button>
//                                         <button
//                                             onClick={() => {
//                                                 if (window.confirm('Are you sure you want to delete this sale?')) {
//                                                     onDeleteSale(sale.id);
//                                                 }
//                                             }}
//                                             className="text-red-500 hover:text-red-700"
//                                             title="Delete Sale"
//                                         >
//                                             <TrashIcon className="h-4 w-4" />
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan="8" className="px-6 py-10 text-center text-gray-500 italic">
//                                     No sales records found for this date.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default DailySales;

import React, { useState } from "react";
import { EditIcon } from "../icons/EditIcon";
import { TrashIcon } from "../icons/TrashIcon";

/**
 * Component to display a filterable table of daily sales records.
 * @param {Object} props
 * @param {Array} props.sales - List of all sale transactions.
 * @param {Array} props.customers - List of customers for lookup.
 * @param {Array} props.salesmen - List of salesmen for lookup.
 * @param {Array} props.inventory - List of inventory items for lookup.
 * @param {Function} props.onEditSale - Callback to edit a specific sale.
 * @param {Function} props.onDeleteSale - Callback to delete a specific sale.
 */
const DailySales = ({
  sales = [],
  customers = [],
  salesmen = [],
  inventory = [],
  onEditSale,
  onDeleteSale,
}) => {
  const getCustomerName = (customerId) => {
   
    return customerId ? customerId.name : "Counter Customer";
  };

  const getSalesmanName = (salesmanId) => {
    if (!salesmanId) return "Not Assigned";
    const targetId = String(
      typeof salesmanId === "object" ? salesmanId._id : salesmanId,
    );
    const salesman = salesmen.find((s) => String(s._id || s.id) === targetId);
    return salesman ? salesman.name : "Unknown Salesman";
  };

  const getItemName = (sale) => {
    if (sale.description) return sale.description;
    if (!sale.inventoryItemId) return "Payment / Generic";
    const targetId = String(
      typeof sale.inventoryItemId === "object"
        ? sale.inventoryItemId._id
        : sale.inventoryItemId,
    );
    const item = inventory.find((i) => String(i._id || i.id) === targetId);
    return item ? item.name : "Unknown Item";
  };

  // Initialize state with today's date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  // Derived state for the table: filtered by date and sorted by time (descending)
  const filteredSales = sales
    .filter((s) => {
      if (!s.date) return false;
      return new Date(s.date).toISOString().split("T")[0] === selectedDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-6 flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 bg-gray-50/80 gap-4">
        <div>
          <h2 className="text-xl font-black text-brand-text-primary tracking-tight">
            Daily Sales Log
          </h2>
          <p className="text-sm font-medium text-brand-text-secondary mt-0.5">
            Showing {filteredSales.length} records for selected date.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white p-1 rounded-lg border border-gray-200 shadow-sm self-start sm:self-auto">
          <input
            id="sale-date-filter"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 bg-transparent border-none focus:outline-none focus:ring-0 sm:text-sm font-bold text-brand-blue cursor-pointer"
          />
        </div>
      </div>

      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-sm text-left text-brand-text-secondary">
          <thead className="text-xs text-brand-text-secondary uppercase bg-white font-bold tracking-wider border-b border-gray-200 sticky top-0 shadow-sm">
            <tr>
              <th scope="col" className="px-6 py-4">
                Time
              </th>
              <th scope="col" className="px-6 py-4">
                Customer
              </th>
              <th scope="col" className="px-6 py-4">
                Item Sold
              </th>
              <th scope="col" className="px-6 py-4">
                Salesman
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Qty
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Amount (PKR)
              </th>
              <th scope="col" className="px-6 py-4 text-center">
                Method
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr
                  key={sale._id || sale.id}
                  className="bg-white hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-500">
                    {new Date(sale.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">
                    {getCustomerName(sale.customerId)}
                  </td>
                  <td
                    className="px-6 py-4 font-medium max-w-[200px] truncate"
                    title={getItemName(sale)}
                  >
                    {getItemName(sale)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {getSalesmanName(sale.salesmanId)}
                  </td>
                  <td className="px-6 py-4 text-center font-black text-brand-text-primary">
                    {sale.quantity > 0 ? sale.quantity : "-"}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-brand-blue">
                    {Number(sale.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-md border ${
                        sale.paymentMethod === "Cash"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : sale.paymentMethod === "Bank"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }`}
                    >
                      {sale.paymentMethod || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditSale(sale)}
                        className="p-1.5 text-brand-text-secondary hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Sale"
                      >
                        <EditIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this transaction? Financial records will be altered.",
                            )
                          ) {
                            onDeleteSale(sale._id || sale.id);
                          }
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Sale"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="px-6 py-16 text-center text-gray-400 italic"
                >
                  No sales records found for{" "}
                  {new Date(selectedDate).toLocaleDateString()}.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailySales;
