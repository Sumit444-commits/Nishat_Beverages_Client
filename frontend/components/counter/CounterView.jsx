import React, { useState, useMemo, useEffect } from 'react';
import { apiService } from '../../api/apiService';
import { getLocalDateString, getTodayLocalDateString } from '../../utils/date';
import { inferPaymentCategoryFromInventory } from '../../utils/payment-category';
import { PlusCircleIcon, LogoutIcon, WaterDropIcon, DollarSignIcon, CreditCardIcon, PackageIcon, TrashIcon } from '../icons';
import AddCounterSaleModal from './AddCounterSaleModal';
import StatCard from '../dashboard/StatCard';
import ConfirmationModal from '../common/ConfirmationModal';
import toast from 'react-hot-toast';

/**
 * Main dashboard for counter staff to record on-site sales via MongoDB.
 * @param {Object} props
 * @param {Object} props.user - The logged-in counter user object.
 * @param {Function} props.onLogout - Callback to end the session.
 */
const CounterView = ({ user, onLogout }) => {
    // Backend State
    const [inventory, setInventory] = useState([]);
    const [todaySales, setTodaySales] = useState([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    // UI State
    const [isAddSaleOpen, setAddSaleOpen] = useState(false);
    const [quickSalePaymentMethod, setQuickSalePaymentMethod] = useState('Cash');
    const [isDeleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [saleToDeleteId, setSaleToDeleteId] = useState(null);

    const today = useMemo(() => getTodayLocalDateString(), []);

    // 1. Fetch initial data from MongoDB on mount
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoadingData(true);
                // Fetch inventory and sales concurrently for speed
                const [invData, salesData] = await Promise.all([
                    apiService.getInventory(),
                    apiService.getSales() // Your backend should ideally support query filters like ?type=counter&date=today
                ]);
                
                setInventory(invData);

                // Filter for today's counter sales (customerId is null for walk-ins)
                const counterSalesToday = salesData
                    .filter(s => s.customerId === null && getLocalDateString(s.date) === today)
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                
                setTodaySales(counterSalesToday);
            } catch (err) {
                console.error("Failed to load counter data:", err);
                toast.error("Failed to load database. Please check connection.");
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchDashboardData();
    }, [today]);

    // 2. Session expiry check
    useEffect(() => {
        const checkSession = () => {
            const counterSession = localStorage.getItem('ro_plant_counter_session');
            if (counterSession) {
                try {
                    const sessionData = JSON.parse(counterSession);
                    if (sessionData.expiresAt && Date.now() >= sessionData.expiresAt) {
                        localStorage.removeItem('ro_plant_counter_session');
                        toast.error('Your session has expired. Please login again.');
                        onLogout();
                    }
                } catch (e) {
                    localStorage.removeItem('ro_plant_counter_session');
                    onLogout();
                }
            } else {
                onLogout();
            }
        };

        const interval = setInterval(checkSession, 60 * 1000);
        checkSession();
        return () => clearInterval(interval);
    }, [onLogout]);

    // 3. Handle adding a new sale to MongoDB
    const handleAddSale = async (saleData) => {
        try {
            const inferredCategory = inferPaymentCategoryFromInventory(
                inventory,
                saleData.inventoryItemId,
                saleData.amountReceived,
                saleData.paymentForCategory
            );

            const payload = {
                ...saleData,
                customerId: user.id ? user.id : null, // Counter sale
                paymentForCategory: inferredCategory,
                date: new Date().toISOString()
            };
            

            // Post to backend
            const newSale = await apiService.addSale(payload);
            
            // Update UI State locally to prevent needing a full reload
            setTodaySales(prev => [newSale, ...prev]);
            
            if (newSale.inventoryItemId) {
                setInventory(prev => prev.map(item => {
                    // Note: MongoDB uses _id instead of id
                    if (item._id === newSale.inventoryItemId || item.id === newSale.inventoryItemId) {
                        return { ...item, stock: item.stock - newSale.quantity };
                    }
                    return item;
                }));
            }
            toast.success("Sale recorded successfully!");
        } catch (err) {
            toast.error(err.message || "Failed to record sale.");
        }
    };
    
    // Quick Sale Handler
    const handleQuickSale = (itemName) => {
        const item = inventory.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()))
        if (!item) {
            toast.error(`${itemName} not found in inventory.`);
            return;
        }
        const newSale = {
            salesmanId: null,
            inventoryItemId: item._id || item.id, // Support MongoDB _id
            quantity: 1,
            emptiesCollected: 0,
            amount: item.sellingPrice,
            amountReceived: item.sellingPrice,
            paymentMethod: quickSalePaymentMethod,
            description: undefined,
        };
        handleAddSale(newSale);
        toast.success("Item Added")
    };
    
    const openDeleteConfirmation = (saleId) => {
        setSaleToDeleteId(saleId);
        setDeleteConfirmOpen(true);
    };

    // 4. Handle deleting a sale from MongoDB
    const handleDeleteSale = async () => {
        if (!saleToDeleteId) return;

        try {
            await apiService.deleteSale(saleToDeleteId);
            
            // Find the sale locally before removing to restore inventory stock
            const saleToDelete = todaySales.find(s => s._id === saleToDeleteId || s.id === saleToDeleteId);
            
            setTodaySales(prev => prev.filter(s => s._id !== saleToDeleteId && s.id !== saleToDeleteId));
            
            if (saleToDelete && saleToDelete.inventoryItemId && saleToDelete.quantity > 0) {
                setInventory(prev => prev.map(item => {
                    if (item._id === saleToDelete.inventoryItemId || item.id === saleToDelete.inventoryItemId) {
                        return { ...item, stock: item.stock + saleToDelete.quantity };
                    }
                    return item;
                }));
            }
            toast.success("Sale deleted and stock restored.");
        } catch (err) {
            toast.error(err.message || "Failed to delete sale.");
        } finally {
            setDeleteConfirmOpen(false);
            setSaleToDeleteId(null);
        }
    };

    const salesSummary = useMemo(() => {
        return todaySales.reduce((acc, sale) => {
            if (sale.paymentMethod === 'Cash') {
                acc.cash += sale.amountReceived;
            } else if (sale.paymentMethod === 'Bank') {
                acc.bank += sale.amountReceived;
            }
            acc.total += sale.amountReceived;
            return acc;
        }, { total: 0, cash: 0, bank: 0 });
    }, [todaySales]);

    const getItemName = (sale) => {
     
        if (sale.description) return sale.description;
        if (sale.inventoryItemId) {
            const item = inventory.find(i => (i._id === sale.inventoryItemId._id));
          
            return item?.name || 'Unknown Item';
        }
        return 'N/A';
    };

    if (isLoadingData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mb-4"></div>
                <p className="text-brand-text-secondary">Loading counter system...</p>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-brand-bg animate-fade-in">
                <header className="bg-white shadow-sm border-b">
                    <div className="px-6 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-brand-text-primary">Counter Sales</h1>
                            {user && <p className="text-sm font-medium text-brand-blue">Active session: {user.name}</p>}
                        </div>
                        <button onClick={onLogout} className="flex items-center bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors shadow-sm font-semibold">
                            <LogoutIcon className="h-5 w-5 mr-2" />
                            <span>End Session</span>
                        </button>
                    </div>
                </header>
                
                <main className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <StatCard title="Total Revenue Today" value={`PKR ${salesSummary.total.toLocaleString()}`} icon={<DollarSignIcon />} color="text-green-500" />
                        <StatCard title="Cash Sales" value={`PKR ${salesSummary.cash.toLocaleString()}`} icon={<DollarSignIcon />} color="text-brand-blue" />
                        <StatCard title="Bank/Card Sales" value={`PKR ${salesSummary.bank.toLocaleString()}`} icon={<CreditCardIcon />} color="text-brand-accent" />
                    </div>

                    <div className="bg-brand-surface rounded-xl shadow-md p-4 mb-6 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button 
                                    onClick={() => handleQuickSale('19ltr')}
                                    className="flex items-center justify-center bg-blue-50 text-brand-blue border border-blue-200 px-6 py-4 rounded-xl font-bold hover:bg-blue-100 hover:shadow transition-all text-lg active:scale-95"
                                >
                                    <PackageIcon className="h-6 w-6 mr-3" />
                                    Quick Sale: 19L Bottle
                                </button>
                                <button 
                                     onClick={() => handleQuickSale('6L')}
                                    className="flex items-center justify-center bg-blue-50 text-brand-blue border border-blue-200 px-6 py-4 rounded-xl font-bold hover:bg-blue-100 hover:shadow transition-all text-lg active:scale-95"
                                >
                                    <PackageIcon className="h-6 w-6 mr-3" />
                                    Quick Sale: 6L Bottle
                                </button>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                 <label className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Payment Method</label>
                                 <div className="flex items-center rounded-lg bg-gray-200 p-1 w-full">
                                    <button onClick={() => setQuickSalePaymentMethod('Cash')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${quickSalePaymentMethod === 'Cash' ? 'bg-white text-green-600 shadow' : 'text-gray-500'}`}>CASH</button>
                                    <button onClick={() => setQuickSalePaymentMethod('Bank')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${quickSalePaymentMethod === 'Bank' ? 'bg-white text-brand-blue shadow' : 'text-gray-500'}`}>BANK</button>
                                 </div>
                            </div>
                        </div>
                        <div className="mt-4 border-t pt-4">
                             <button 
                                onClick={() => setAddSaleOpen(true)}
                                className="w-full flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-900 transition-all shadow-md active:scale-[0.99]"
                            >
                                <PlusCircleIcon className="h-6 w-6 mr-2" />
                                Add Manual / Custom Sale
                            </button>
                        </div>
                    </div>

                    

                    <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="p-6 border-b bg-gray-50">
                            <h2 className="text-xl font-bold text-brand-text-primary">Today's Counter Ledger</h2>
                        </div>
                        <div className="overflow-x-auto max-h-96">
                            <table className="w-full text-sm text-left text-brand-text-secondary">
                                <thead className="text-xs uppercase bg-gray-100 sticky top-0 shadow-sm">
                                    <tr>
                                        <th className="px-6 py-3">Time</th>
                                        <th className="px-6 py-3">Item / Description</th>
                                        <th className="px-6 py-3">Quantity</th>
                                        <th className="px-6 py-3">Payment Method</th>
                                        <th className="px-6 py-3 text-right">Amount (PKR)</th>
                                        <th className="px-6 py-3 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {todaySales.map(sale => (
                                        <tr key={sale._id || sale.id} className="bg-white hover:bg-blue-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{new Date(sale.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                                            <td className="px-6 py-4 font-bold text-brand-text-primary">{getItemName(sale)}</td>
                                            <td className="px-6 py-4 font-semibold">{sale.quantity > 0 ? sale.quantity : '-'}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                                    sale.paymentMethod === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`
                                                }>
                                                    {sale.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-bold text-brand-text-primary">
                                                {sale.amount.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button 
                                                    onClick={() => openDeleteConfirmation(sale._id || sale.id)} 
                                                    className="p-2 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white rounded transition-colors" 
                                                    title="Reverse Sale"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {todaySales.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-16 text-gray-400 italic">
                                                No counter sales recorded yet today.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            
            <AddCounterSaleModal 
                user={user}
                isOpen={isAddSaleOpen}
                onClose={() => setAddSaleOpen(false)}
                onAddSale={handleAddSale}
                inventory={inventory} // Passing MongoDB inventory
            />
            
            <ConfirmationModal 
                isOpen={isDeleteConfirmOpen}
                onClose={() => setDeleteConfirmOpen(false)}
                onConfirm={handleDeleteSale}
                title="Reverse Sale"
                message="Are you sure you want to reverse this transaction? This will automatically restore the item stock to the inventory."
            />
        </>
    );
};

export default CounterView;