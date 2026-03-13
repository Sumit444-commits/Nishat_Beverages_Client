
import React from 'react';

/**
 * A helper to format numbers as PKR strings or return '-' for zero.
 * @param {string|number} value 
 */
const formatValue = (value) => {
    if (value === '-' || value === '') return value;
    const num = Number(value);
    if (isNaN(num)) return value; // Return as-is if it's a pure string like "Cash" or "Bank"
    if (num === 0) return '-';
    return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
};

/**
 * Renders a row for the Dashboard reconciliation table.
 * @param {Object} props
 * @param {string} props.title - The label for the stat (e.g., '19L Collection').
 * @param {string|number} props.cash - Cash amount.
 * @param {string|number} props.bank - Bank/Digital amount.
 * @param {string|number} props.total - Combined total.
 * @param {boolean} [props.isBold=false] - Emphasize text weight.
 * @param {boolean} [props.isSubItem=false] - Add indentation for child categories.
 * @param {boolean} [props.isHighlighted=false] - Apply a warning/success background (for differences).
 */
const DashboardStatBox = ({
    title,
    cash,
    bank,
    total,
    isBold = false,
    isSubItem = false,
    isHighlighted = false,
}) => {
    // Dynamic Tailwind classes for structure and layout
    const baseClasses = "flex justify-between items-center p-4 border-b border-gray-100 transition-colors duration-200";
    
    // Intelligent background colors based on row context
    let bgClass = "bg-white hover:bg-blue-50/30";
    if (isHighlighted) {
        const numTotal = Number(total);
        bgClass = (numTotal !== 0 && !isNaN(numTotal)) ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100';
    } else if (isBold) {
        bgClass = "bg-gray-50/80 border-t-2 border-gray-200";
    }

    // Typography styling
    const textClass = isBold ? 'font-black text-brand-text-primary' : 'font-medium text-brand-text-secondary';
    
    // CSS trick to draw a little "L" bracket for sub-items
    const titleClass = isSubItem 
        ? 'pl-8 text-gray-500 relative before:content-[""] before:absolute before:left-3 before:top-1/2 before:-translate-y-1/2 before:w-3 before:h-px before:bg-gray-300 before:border-l before:border-gray-300 before:h-4 before:-mt-2' 
        : '';
    
    // Highlight logic: specifically used to make financial discrepancies pop
    let totalColorClass = isBold ? 'text-brand-blue' : 'text-brand-text-primary';
    if (isHighlighted) {
        const numTotal = Number(total);
        totalColorClass = (numTotal !== 0 && !isNaN(numTotal)) ? 'text-red-600' : 'text-green-600';
    }

    return (
        <div className={`${baseClasses} ${bgClass} ${textClass}`}>
            <div className={`flex-1 truncate pr-2 ${titleClass}`}>
                {title}
            </div>
            <div className="flex items-center text-sm sm:text-base">
                <div className="w-20 sm:w-28 text-right truncate pr-2 sm:pr-4">{formatValue(cash)}</div>
                <div className="w-20 sm:w-28 text-right truncate pr-2 sm:pr-4">{formatValue(bank)}</div>
                <div className={`w-24 sm:w-32 text-right font-black ${totalColorClass} truncate`}>
                    {formatValue(total)}
                </div>
            </div>
        </div>
    );
};

export default DashboardStatBox;