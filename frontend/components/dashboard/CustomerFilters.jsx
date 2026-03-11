// import React from 'react';
// import { SearchIcon } from '../icons/SearchIcon';

// /**
//  * Component for filtering the customer list by search term, status, and due date.
//  * @param {Object} props
//  * @param {string} props.searchTerm - Current search input value.
//  * @param {Function} props.onSearchChange - Callback when search input changes.
//  * @param {string} props.statusFilter - 'all', 'pending', or 'paid'.
//  * @param {Function} props.onStatusFilterChange - Callback to update status filter.
//  * @param {boolean} props.dueFilter - Whether to show only customers due today.
//  * @param {Function} props.onDueFilterChange - Callback to toggle due filter.
//  */
// const CustomerFilters = ({
//     searchTerm,
//     onSearchChange,
//     statusFilter,
//     onStatusFilterChange,
//     dueFilter,
//     onDueFilterChange
// }) => {
//     return (
//         <div className="mb-6 p-4 bg-brand-surface rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
//             {/* Search Input Section */}
//             <div className="relative w-full md:w-1/3">
//                 <input
//                     type="text"
//                     placeholder="Search by name, phone, area, address..."
//                     value={searchTerm}
//                     onChange={(e) => onSearchChange(e.target.value)}
//                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
//                 />
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <SearchIcon className="h-5 w-5 text-gray-400" />
//                 </div>
//             </div>

//             {/* Filter Buttons Section */}
//             <div className="flex items-center gap-2 flex-wrap justify-center md:justify-end">
//                 <span className="text-sm font-medium text-brand-text-secondary mr-2">Filter by:</span>
                
//                 <button 
//                     type="button"
//                     onClick={() => onStatusFilterChange('all')}
//                     className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === 'all' ? 'bg-brand-blue text-white shadow' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}
//                 >
//                     All
//                 </button>
                
//                 <button 
//                     type="button"
//                     onClick={() => onStatusFilterChange('pending')}
//                     className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === 'pending' ? 'bg-yellow-500 text-white shadow' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}
//                 >
//                     Pending
//                 </button>
                
//                 <button 
//                     type="button"
//                     onClick={() => onStatusFilterChange('paid')}
//                     className={`px-3 py-1 text-sm rounded-full transition-colors ${statusFilter === 'paid' ? 'bg-green-500 text-white shadow' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}
//                 >
//                     Paid
//                 </button>
                
//                 <div className="h-6 border-l border-gray-300 mx-2 hidden sm:block"></div>
                
//                 {/* Due Today Toggle */}
//                 <label className="flex items-center cursor-pointer">
//                     <input 
//                         type="checkbox" 
//                         checked={dueFilter} 
//                         onChange={(e) => onDueFilterChange(e.target.checked)} 
//                         className="sr-only"
//                     />
//                     <div className={`px-3 py-1 text-sm rounded-full transition-colors flex items-center ${dueFilter ? 'bg-red-500 text-white shadow' : 'bg-gray-200 text-brand-text-secondary hover:bg-gray-300'}`}>
//                         <span className={`mr-2 h-3 w-3 rounded-full border-2 transition-all ${dueFilter ? 'bg-white border-red-500' : 'bg-transparent border-gray-400'}`}></span>
//                         Due Today Only
//                     </div>
//                 </label>
//             </div>
//         </div>
//     );
// };

// export default CustomerFilters;



import React from 'react';
import { SearchIcon } from '../icons/SearchIcon';

/**
 * Component for filtering the customer list by search term, status, and due date.
 * @param {Object} props
 * @param {string} props.searchTerm - Current search input value.
 * @param {Function} props.onSearchChange - Callback when search input changes.
 * @param {string} props.statusFilter - 'all', 'pending', or 'paid'.
 * @param {Function} props.onStatusFilterChange - Callback to update status filter.
 * @param {boolean} props.dueFilter - Whether to show only customers due today.
 * @param {Function} props.onDueFilterChange - Callback to toggle due filter.
 */
const CustomerFilters = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    dueFilter,
    onDueFilterChange
}) => {
    return (
        <div className="mb-6 p-5 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col lg:flex-row items-center justify-between gap-5 animate-fade-in">
            {/* Search Input Section */}
            <div className="relative w-full lg:w-2/5">
                <input
                    type="text"
                    placeholder="Search by name, phone, area, address..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm font-medium"
                />
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>

            {/* Filter Buttons Section */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
                    <button 
                        type="button"
                        onClick={() => onStatusFilterChange('all')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${statusFilter === 'all' ? 'bg-white text-brand-text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        All
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => onStatusFilterChange('pending')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${statusFilter === 'pending' ? 'bg-red-50 text-red-600 shadow-sm border border-red-100' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Has Balance
                    </button>
                    
                    <button 
                        type="button"
                        onClick={() => onStatusFilterChange('paid')}
                        className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${statusFilter === 'paid' ? 'bg-green-50 text-green-600 shadow-sm border border-green-100' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Clear
                    </button>
                </div>
                
                <div className="h-8 border-l border-gray-200 mx-1 hidden sm:block"></div>
                
                {/* Due Today Toggle */}
                <label className="flex items-center cursor-pointer w-full sm:w-auto mt-2 sm:mt-0">
                    <input 
                        type="checkbox" 
                        checked={dueFilter} 
                        onChange={(e) => onDueFilterChange(e.target.checked)} 
                        className="sr-only"
                    />
                    <div className={`w-full sm:w-auto px-4 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center border ${dueFilter ? 'bg-brand-blue text-white border-brand-blue shadow-md' : 'bg-white text-brand-text-secondary border-gray-200 hover:bg-gray-50'}`}>
                        <span className={`mr-2 h-2.5 w-2.5 rounded-full transition-all ${dueFilter ? 'bg-white' : 'bg-gray-300'}`}></span>
                        Due For Delivery
                    </div>
                </label>
            </div>
        </div>
    );
};

export default CustomerFilters;