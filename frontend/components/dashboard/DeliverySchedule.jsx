// import React, { useMemo, useState } from 'react';
// import { isDeliveryDueOn } from '../../utils/delivery-helper';
// import { TruckIcon, UsersIcon } from '../icons';

// /**
//  * Component for viewing and managing the 7-day rolling delivery schedule.
//  * Organized by Area and assigned Salesman.
//  * @param {Object} props
//  * @param {Array} props.customers - List of all customers.
//  * @param {Array} props.sales - Global sales history for calculating due dates.
//  * @param {Array} props.areaAssignments - Mapping of areas to specific salesmen.
//  * @param {Array} props.salesmen - List of all salesmen.
//  * @param {Function} props.onNavigateToAreaAssignment - Navigation callback.
//  * @param {Function} props.onViewCustomerDetails - Callback to view profile.
//  * @param {Function} props.onViewSalesmanDetails - Callback to view salesman profile.
//  */
// const DeliverySchedule = ({ 
//     customers, 
//     sales, 
//     areaAssignments, 
//     salesmen,
//     onNavigateToAreaAssignment,
//     onViewCustomerDetails,
//     onViewSalesmanDetails
// }) => {
//     // Current date state for schedule starting point
//     const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
//     // Generate an array representing the next 7 days
//     const weekDays = Array.from({ length: 7 }, (_, i) => {
//         const d = new Date();
//         d.setDate(d.getDate() + i);
//         return d;
//     });

//     // Extract all unique area names from the customer list
//     const allAreas = useMemo(() => {
//         const areaSet = new Set();
//         customers.forEach(c => {
//             if (c.area && c.area.trim()) {
//                 areaSet.add(c.area.trim());
//             }
//         });
//         return Array.from(areaSet).sort();
//     }, [customers]);

//     // Group the customer database by area for efficient lookup
//     const customersByArea = useMemo(() => {
//         const grouped = {};
//         customers.forEach(customer => {
//             const area = customer.area?.trim() || 'Unassigned Area';
//             if (!grouped[area]) {
//                 grouped[area] = [];
//             }
//             grouped[area].push(customer);
//         });
//         return grouped;
//     }, [customers]);

//     // Helper to find the salesman assigned to a specific geographical area
//     const getSalesmanForArea = (area) => {
//         const assignment = areaAssignments.find(a => a.area === area);
//         if (assignment && assignment.salesmanId) {
//             return salesmen.find(s => s.id === assignment.salesmanId) || null;
//         }
//         return null;
//     };

//     /**
//      * Logic to determine which customers are due for water on a specific date,
//      * grouped by their assigned area.
//      */
//     const getDeliveriesByArea = (date) => {
//         const deliveriesByArea = {};
        
//         allAreas.forEach(area => {
//             const areaCustomers = customersByArea[area] || [];
//             const dueCustomers = areaCustomers.filter(customer => isDeliveryDueOn(date, customer, sales));
            
//             if (dueCustomers.length > 0) {
//                 deliveriesByArea[area] = {
//                     customers: dueCustomers,
//                     salesman: getSalesmanForArea(area)
//                 };
//             }
//         });

//         // Capture customers who haven't been assigned an area yet
//         const unassignedCustomers = (customersByArea['Unassigned Area'] || []).filter(customer => 
//             isDeliveryDueOn(date, customer, sales)
//         );

//         if (unassignedCustomers.length > 0) {
//             deliveriesByArea['Unassigned Area'] = {
//                 customers: unassignedCustomers,
//                 salesman: null
//             };
//         }

//         return deliveriesByArea;
//     };

//     // Build the 7-day schedule object
//     const schedule = weekDays.map(date => ({
//         date,
//         deliveriesByArea: getDeliveriesByArea(date)
//     }));

//     const totalDeliveriesToday = useMemo(() => {
//         const today = new Date();
//         const todayDeliveries = getDeliveriesByArea(today);
//         return Object.values(todayDeliveries).reduce((sum, area) => sum + area.customers.length, 0);
//     }, [customers, sales, allAreas, customersByArea, areaAssignments, salesmen]);

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center flex-wrap gap-4">
//                 <div>
//                     <h1 className="text-3xl font-bold text-brand-text-primary">Area-Wise Delivery Schedule</h1>
//                     <p className="text-brand-text-secondary mt-1">
//                         Organized by area for the next 7 days
//                     </p>
//                 </div>
//                 <button
//                     onClick={onNavigateToAreaAssignment}
//                     className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors shadow-sm"
//                 >
//                     <TruckIcon className="h-5 w-5 mr-2" />
//                     Manage Area Assignments
//                 </button>
//             </div>

            

//             {/* Summary Row */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="bg-brand-surface rounded-lg shadow-md p-4 border-l-4 border-blue-500">
//                     <p className="text-sm text-brand-text-secondary uppercase font-bold tracking-wider">Total Areas</p>
//                     <p className="text-2xl font-bold text-brand-text-primary">{allAreas.length}</p>
//                 </div>
//                 <div className="bg-brand-surface rounded-lg shadow-md p-4 border-l-4 border-green-500">
//                     <p className="text-sm text-brand-text-secondary uppercase font-bold tracking-wider">Today's Deliveries</p>
//                     <p className="text-2xl font-bold text-brand-text-primary">{totalDeliveriesToday}</p>
//                 </div>
//                 <div className="bg-brand-surface rounded-lg shadow-md p-4 border-l-4 border-purple-500">
//                     <p className="text-sm text-brand-text-secondary uppercase font-bold tracking-wider">Assigned Salesmen</p>
//                     <p className="text-2xl font-bold text-brand-text-primary">
//                         {new Set(areaAssignments.filter(a => a.salesmanId).map(a => a.salesmanId)).size}
//                     </p>
//                 </div>
//             </div>
            
//             {/* 7-Day Horizontal Scroll/Grid View */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
//                 {schedule.map(({ date, deliveriesByArea }, index) => {
//                     const isToday = index === 0;
//                     const areaEntries = Object.entries(deliveriesByArea);
                    
//                     return (
//                         <div key={index} className="bg-brand-surface rounded-lg shadow-md flex flex-col min-h-[500px]">
//                             <div className={`p-3 text-center rounded-t-lg ${isToday ? 'bg-brand-blue text-white' : 'bg-gray-100'}`}>
//                                 <p className="font-bold text-lg">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
//                                 <p className="text-sm">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
//                                 {isToday && <p className="text-xs mt-1 opacity-90 font-bold uppercase">Today</p>}
//                             </div>
//                             <div className="p-3 space-y-3 flex-1 overflow-y-auto">
//                                 {areaEntries.length > 0 ? (
//                                     areaEntries.map(([area, { customers: dueCustomers, salesman }]) => (
//                                         <div key={area} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
//                                             <div className="flex justify-between items-start mb-2">
//                                                 <div className="flex-1">
//                                                     <h3 className="font-bold text-xs text-brand-text-primary mb-1 uppercase tracking-tight">{area}</h3>
//                                                     {salesman ? (
//                                                         <button
//                                                             onClick={() => onViewSalesmanDetails(salesman.id)}
//                                                             className="flex items-center text-[10px] text-brand-blue hover:underline"
//                                                         >
//                                                             <TruckIcon className="h-3 w-3 mr-1" />
//                                                             {salesman.name}
//                                                         </button>
//                                                     ) : (
//                                                         <p className="text-[10px] text-gray-400 italic">Unassigned</p>
//                                                     )}
//                                                 </div>
//                                                 <span className="text-[10px] font-bold text-white bg-brand-blue px-1.5 py-0.5 rounded">
//                                                     {dueCustomers.length}
//                                                 </span>
//                                             </div>
//                                             <div className="space-y-1 mt-2">
//                                                 {dueCustomers.map(customer => (
//                                                     <div 
//                                                         key={customer.id} 
//                                                         className="p-1.5 bg-gray-50 rounded border border-gray-100 hover:bg-blue-50 transition-all cursor-pointer"
//                                                         onClick={() => onViewCustomerDetails(customer)}
//                                                     >
//                                                         <p className="font-medium text-[10px] text-brand-text-primary truncate">{customer.name}</p>
//                                                         <p className="text-[9px] text-brand-text-secondary truncate">{customer.mobile}</p>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ))
//                                 ) : (
//                                     <div className="flex items-center justify-center h-full opacity-30 italic">
//                                         <p className="text-xs text-center text-gray-400 p-4">Clean slate</p>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Bottom Area Summary Grid */}
//             <div className="bg-brand-surface rounded-xl shadow-md p-6">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold text-brand-text-primary">Area Master List</h2>
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {allAreas.map(area => {
//                         const areaCustomers = customersByArea[area] || [];
//                         const todayDueCount = areaCustomers.filter(c => isDeliveryDueOn(new Date(), c, sales)).length;
//                         const salesman = getSalesmanForArea(area);
                        
//                         return (
//                             <div key={area} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                                 <div className="flex justify-between items-start mb-2">
//                                     <h3 className="font-bold text-brand-text-primary">{area}</h3>
//                                     <span className={`text-xs font-bold px-2 py-1 rounded-full ${todayDueCount > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
//                                         {todayDueCount} due today
//                                     </span>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <p className="text-xs text-brand-text-secondary flex items-center">
//                                         <UsersIcon className="h-3 w-3 mr-1" />
//                                         Total Customers: {areaCustomers.length}
//                                     </p>
//                                     {salesman ? (
//                                         <button
//                                             onClick={() => onViewSalesmanDetails(salesman.id)}
//                                             className="flex items-center text-xs text-brand-blue font-semibold hover:underline"
//                                         >
//                                             <TruckIcon className="h-3 w-3 mr-1" />
//                                             Agent: {salesman.name}
//                                         </button>
//                                     ) : (
//                                         <p className="text-xs text-red-400 italic">No agent assigned</p>
//                                     )}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default DeliverySchedule;


import React, { useMemo, useState } from 'react';
import { isDeliveryDueOn } from '../../utils/delivery-helper';
import { TruckIcon, UsersIcon } from '../icons';

/**
 * Component for viewing and managing the 7-day rolling delivery schedule.
 * Organized by Area and assigned Salesman.
 * @param {Object} props
 * @param {Array} props.customers - List of all customers.
 * @param {Array} props.sales - Global sales history for calculating due dates.
 * @param {Array} props.areaAssignments - Mapping of areas to specific salesmen.
 * @param {Array} props.salesmen - List of all salesmen.
 * @param {Function} props.onNavigateToAreaAssignment - Navigation callback.
 * @param {Function} props.onViewCustomerDetails - Callback to view profile.
 * @param {Function} props.onViewSalesmanDetails - Callback to view salesman profile.
 */
const DeliverySchedule = ({ 
    customers = [], 
    sales = [], 
    areaAssignments = [], 
    salesmen = [],
    onNavigateToAreaAssignment,
    onViewCustomerDetails,
    onViewSalesmanDetails
}) => {
    // Current date state for schedule starting point
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Generate an array representing the next 7 days based on selectedDate
    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() + i);
            return d;
        });
    }, [selectedDate]);

    // Extract all unique area names from the customer list
    const allAreas = useMemo(() => {
        const areaSet = new Set();
        customers.forEach(c => {
            if (c.area && c.area.trim()) {
                areaSet.add(c.area.trim());
            }
        });
        return Array.from(areaSet).sort();
    }, [customers]);

    // Group the customer database by area for efficient lookup
    const customersByArea = useMemo(() => {
        const grouped = {};
        customers.forEach(customer => {
            const area = customer.area?.trim() || 'Unassigned Area';
            if (!grouped[area]) {
                grouped[area] = [];
            }
            grouped[area].push(customer);
        });
        return grouped;
    }, [customers]);

    // Helper to find the salesman assigned to a specific geographical area using MongoDB _id
    const getSalesmanForArea = (area) => {
        const assignment = areaAssignments.find(a => a.area === area);
        if (assignment && assignment.salesmanId) {
            const sId = String(typeof assignment.salesmanId === 'object' ? assignment.salesmanId._id : assignment.salesmanId);
            return salesmen.find(s => String(s._id || s.id) === sId) || null;
        }
        return null;
    };

    /**
     * Logic to determine which customers are due for water on a specific date,
     * grouped by their assigned area.
     */
    const getDeliveriesByArea = (date) => {
        const deliveriesByArea = {};
        
        allAreas.forEach(area => {
            const areaCustomers = customersByArea[area] || [];
            const dueCustomers = areaCustomers.filter(customer => isDeliveryDueOn(date, customer, sales));
            
            if (dueCustomers.length > 0) {
                deliveriesByArea[area] = {
                    customers: dueCustomers,
                    salesman: getSalesmanForArea(area)
                };
            }
        });

        // Capture customers who haven't been assigned an area yet
        const unassignedCustomers = (customersByArea['Unassigned Area'] || []).filter(customer => 
            isDeliveryDueOn(date, customer, sales)
        );

        if (unassignedCustomers.length > 0) {
            deliveriesByArea['Unassigned Area'] = {
                customers: unassignedCustomers,
                salesman: null
            };
        }

        return deliveriesByArea;
    };

    // Build the 7-day schedule object
    const schedule = useMemo(() => {
        return weekDays.map(date => ({
            date,
            deliveriesByArea: getDeliveriesByArea(date)
        }));
    }, [weekDays, customers, sales, allAreas, customersByArea, areaAssignments, salesmen]);

    const totalDeliveriesToday = useMemo(() => {
        // Using the first day of the generated week array as "Today"
        const todayDeliveries = getDeliveriesByArea(weekDays[0]);
        return Object.values(todayDeliveries).reduce((sum, area) => sum + area.customers.length, 0);
    }, [weekDays, customers, sales, allAreas, customersByArea, areaAssignments, salesmen]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Delivery Schedule</h1>
                    <p className="text-brand-text-secondary mt-1">
                        7-Day rolling forecast for area routes and customer requirements.
                    </p>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm font-bold text-brand-text-primary cursor-pointer transition-all"
                    />
                    <button
                        onClick={onNavigateToAreaAssignment}
                        className="flex items-center justify-center bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-lightblue transition-all shadow-md active:scale-95 flex-1 md:flex-none whitespace-nowrap"
                    >
                        <TruckIcon className="h-5 w-5 mr-2" />
                        Manage Areas
                    </button>
                </div>
            </div>

            

            {/* Summary Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                    <p className="text-xs text-brand-text-secondary uppercase font-bold tracking-wider mb-1">Total Coverage Areas</p>
                    <p className="text-4xl font-black text-brand-text-primary">{allAreas.length}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500"></div>
                    <p className="text-xs text-brand-text-secondary uppercase font-bold tracking-wider mb-1">Due {new Date(selectedDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</p>
                    <p className="text-4xl font-black text-brand-text-primary">{totalDeliveriesToday}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
                    <p className="text-xs text-brand-text-secondary uppercase font-bold tracking-wider mb-1">Active Salesmen Routes</p>
                    <p className="text-4xl font-black text-brand-text-primary">
                        {new Set(areaAssignments.filter(a => a.salesmanId).map(a => String(typeof a.salesmanId === 'object' ? a.salesmanId._id : a.salesmanId))).size}
                    </p>
                </div>
            </div>
            
            {/* 7-Day Horizontal Scroll/Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4">
                {schedule.map(({ date, deliveriesByArea }, index) => {
                    const isToday = index === 0;
                    const areaEntries = Object.entries(deliveriesByArea);
                    const totalForDay = areaEntries.reduce((sum, [, {customers}]) => sum + customers.length, 0);
                    
                    return (
                        <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-[500px] xl:min-h-[600px] overflow-hidden">
                            <div className={`p-4 text-center border-b ${isToday ? 'bg-brand-blue text-white border-brand-blue' : 'bg-gray-50 border-gray-100'}`}>
                                <p className={`font-black text-xl ${isToday ? 'text-white' : 'text-brand-text-primary'}`}>
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </p>
                                <p className={`text-sm font-medium ${isToday ? 'text-blue-100' : 'text-brand-text-secondary'}`}>
                                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </p>
                                {isToday && <p className="text-[10px] mt-1.5 bg-white/20 inline-block px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Selected</p>}
                            </div>
                            
                            <div className="p-1 bg-gray-100/50 text-center border-b border-gray-100">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{totalForDay} Deliver{totalForDay === 1 ? 'y' : 'ies'}</span>
                            </div>

                            <div className="p-3 space-y-4 flex-1 overflow-y-auto">
                                {areaEntries.length > 0 ? (
                                    areaEntries.map(([area, { customers: dueCustomers, salesman }]) => (
                                        <div key={area} className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:border-brand-blue transition-colors group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1 min-w-0 pr-2">
                                                    <h3 className="font-black text-xs text-brand-text-primary mb-1 uppercase tracking-tight truncate" title={area}>{area}</h3>
                                                    {salesman ? (
                                                        <button
                                                            onClick={() => onViewSalesmanDetails(salesman._id || salesman.id)}
                                                            className="flex items-center text-[10px] font-bold text-brand-blue hover:text-brand-lightblue transition-colors truncate w-full text-left"
                                                            title={salesman.name}
                                                        >
                                                            <TruckIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                                                            <span className="truncate">{salesman.name}</span>
                                                        </button>
                                                    ) : (
                                                        <p className="text-[10px] font-bold text-gray-400 italic flex items-center">
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                            Unassigned
                                                        </p>
                                                    )}
                                                </div>
                                                <span className="text-[10px] font-black text-brand-blue bg-blue-50 border border-blue-100 px-2 py-1 rounded-md shadow-inner">
                                                    {dueCustomers.length}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5 pt-2 border-t border-gray-50">
                                                {dueCustomers.map(customer => (
                                                    <div 
                                                        key={customer._id || customer.id} 
                                                        className="p-2 bg-gray-50 rounded-md border border-gray-100 hover:bg-blue-50/50 hover:border-blue-200 transition-all cursor-pointer"
                                                        onClick={() => onViewCustomerDetails(customer)}
                                                    >
                                                        <p className="font-bold text-[11px] text-brand-text-primary truncate" title={customer.name}>{customer.name}</p>
                                                        <p className="text-[9px] text-brand-text-secondary truncate mt-0.5">{customer.address}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full opacity-40 py-10">
                                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
                                        <p className="text-xs font-bold text-center uppercase tracking-wider">All Clear</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Area Summary Grid */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 lg:p-8">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Area Master Registry</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {allAreas.map(area => {
                        const areaCustomers = customersByArea[area] || [];
                        // Calculate due based on user's selected date, not necessarily actual "today"
                        const todayDueCount = areaCustomers.filter(c => isDeliveryDueOn(new Date(selectedDate), c, sales)).length;
                        const salesman = getSalesmanForArea(area);
                        
                        return (
                            <div key={area} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-brand-blue transition-all group">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-black text-brand-text-primary text-lg truncate pr-2" title={area}>{area}</h3>
                                    <span className={`flex-shrink-0 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${todayDueCount > 0 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                                        {todayDueCount} due
                                    </span>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
                                        <span className="text-brand-text-secondary font-medium flex items-center">
                                            <UsersIcon className="h-4 w-4 mr-2" />
                                            Customers
                                        </span>
                                        <span className="font-black text-brand-text-primary">{areaCustomers.length}</span>
                                    </div>
                                    
                                    {salesman ? (
                                        <button
                                            onClick={() => onViewSalesmanDetails(salesman._id || salesman.id)}
                                            className="w-full flex items-center justify-between text-sm bg-blue-50/50 hover:bg-blue-100 p-2 rounded-lg border border-blue-100 transition-colors"
                                        >
                                            <span className="text-brand-blue font-bold flex items-center">
                                                <TruckIcon className="h-4 w-4 mr-2" />
                                                Agent
                                            </span>
                                            <span className="font-bold text-brand-blue truncate max-w-[120px]">{salesman.name}</span>
                                        </button>
                                    ) : (
                                        <div className="w-full flex items-center justify-between text-sm bg-red-50/50 p-2 rounded-lg border border-red-100">
                                            <span className="text-red-500 font-bold flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                Agent
                                            </span>
                                            <span className="font-bold text-red-500">Unassigned</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default DeliverySchedule;