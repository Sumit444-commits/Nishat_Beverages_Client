// import React from 'react';

// /**
//  * A reusable card for displaying key performance indicators (KPIs).
//  * Used throughout the dashboard for Revenue, Expenses, and Stock levels.
//  * @param {Object} props
//  * @param {string} props.title - The label for the statistic.
//  * @param {string} props.value - The numerical or text value to display.
//  * @param {React.ReactNode} props.icon - The SVG icon component.
//  * @param {string} [props.color='text-brand-blue'] - Tailwind text color class for the icon.
//  * @param {Function} [props.onClick] - Optional click handler for navigation or modals.
//  */
// const StatCard = ({ 
//     title, 
//     value, 
//     icon, 
//     color = 'text-brand-blue', 
//     onClick 
// }) => {
//     // Dynamic classes based on whether the card is interactive
//     const cardClasses = `bg-brand-surface p-6 rounded-xl shadow-md flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
//         onClick ? 'cursor-pointer' : ''
//     }`;
    
//     return (
//         <div className={cardClasses} onClick={onClick}>
//             <div>
//                 <p className="text-sm font-medium text-brand-text-secondary">{title}</p>
//                 <p className="text-2xl font-bold text-brand-text-primary">{value}</p>
//             </div>
//             <div className={`text-4xl ${color}`}>
//                 {icon}
//             </div>
//         </div>
//     );
// };

// export default StatCard;

import React from 'react';

/**
 * A reusable card for displaying key performance indicators (KPIs).
 * Used throughout the dashboard for Revenue, Expenses, and Stock levels.
 * @param {Object} props
 * @param {string} props.title - The label for the statistic.
 * @param {string} props.value - The numerical or text value to display.
 * @param {React.ReactNode} props.icon - The SVG icon component.
 * @param {string} [props.color='text-brand-blue'] - Tailwind text color class for the icon.
 * @param {Function} [props.onClick] - Optional click handler for navigation or modals.
 */
const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'text-brand-blue', 
    onClick 
}) => {
    // Dynamic classes based on whether the card is interactive
    const cardClasses = `bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between transition-all duration-300 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1 hover:border-brand-blue group' : ''
    }`;
    
    // Determine a faint background color for the icon based on the passed text color
    let bgColorClass = 'bg-gray-50';
    if (color.includes('green')) bgColorClass = 'bg-green-50';
    else if (color.includes('red')) bgColorClass = 'bg-red-50';
    else if (color.includes('yellow')) bgColorClass = 'bg-yellow-50';
    else if (color.includes('blue')) bgColorClass = 'bg-blue-50';
    else if (color.includes('orange')) bgColorClass = 'bg-orange-50';
    else if (color.includes('indigo')) bgColorClass = 'bg-indigo-50';
    else if (color.includes('purple')) bgColorClass = 'bg-purple-50';

    return (
        <div className={cardClasses} onClick={onClick}>
            <div className="z-10">
                <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">{title}</p>
                <p className="text-2xl font-black text-brand-text-primary tracking-tight">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${bgColorClass} ${color} ${onClick ? 'group-hover:scale-110 transition-transform duration-300' : ''}`}>
                <div className="w-8 h-8 flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default StatCard;