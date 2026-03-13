
import React, { useMemo } from 'react';

/**
 * Modal to display the calculated opening balance history for the last 30 days.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Array} props.sales - List of sales for financial calculation.
 * @param {Array} props.expenses - List of expenses for financial calculation.
 */
const OpeningBalanceHistoryModal = ({ isOpen, onClose, sales = [], expenses = [] }) => {
    
    // Calculate the running opening balance history
    const history = useMemo(() => {
        if (!isOpen) return [];

        // Combine sales (+) and expenses (-) into a single timeline
        const allTransactions = [
            ...sales.filter(s => s.date).map(s => ({ date: new Date(s.date), amount: Number(s.amountReceived) || 0 })),
            ...expenses.filter(e => e.date).map(e => ({ date: new Date(e.date), amount: -(Number(e.amount) || 0) })),
        ].sort((a, b) => a.date.getTime() - b.date.getTime());

        const dailyHistory = [];
        
        // Loop backwards from today to generate the last 30 days of data
        for (let i = 0; i < 30; i++) {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - i);
            targetDate.setHours(0, 0, 0, 0);

            // Logic: Opening balance today = Sum of all transactions before today
            const dayBefore = new Date(targetDate);
            dayBefore.setDate(dayBefore.getDate() - 1);
            const endOfDayBefore = new Date(dayBefore);
            endOfDayBefore.setHours(23, 59, 59, 999);

            let closingBalanceDayBefore = 0;
            
            // Optimization: Since transactions are sorted, we can calculate the aggregate sum
            for (const trans of allTransactions) {
                if (trans.date <= endOfDayBefore) {
                    closingBalanceDayBefore += trans.amount;
                } else {
                    break; 
                }
            }
            
            dailyHistory.push({
                date: targetDate.toLocaleDateString('en-CA'), // Standard YYYY-MM-DD
                openingBalance: closingBalanceDayBefore
            });
        }

        return dailyHistory;
    }, [sales, expenses, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-lg max-h-[90vh] flex flex-col animate-fade-in overflow-hidden border border-gray-100">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                    <div>
                        <h2 className="text-xl font-black text-brand-text-primary tracking-tight">
                            Opening Balance History
                        </h2>
                        <p className="text-brand-text-secondary text-sm mt-1">Calculated for the last 30 days.</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Ledger Table */}
                <div className="overflow-y-auto flex-grow p-6">
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left text-brand-text-secondary">
                            <thead className="text-xs text-brand-text-secondary uppercase bg-gray-100/80 font-bold tracking-wider sticky top-0 border-b border-gray-200 shadow-sm z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Date</th>
                                    <th scope="col" className="px-6 py-4 text-right">Opening Balance (PKR)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {history.map(({ date, openingBalance }) => (
                                    <tr key={date} className="hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">
                                            {new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className={`px-6 py-4 text-right font-black ${
                                            openingBalance < 0 ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                            {openingBalance.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end flex-shrink-0">
                     <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-6 py-2.5 bg-white border border-gray-300 text-brand-text-secondary rounded-lg font-bold shadow-sm hover:bg-gray-50 transition-all active:scale-95"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OpeningBalanceHistoryModal;