
import React from 'react';

const Stock = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Active Stock</h1>
                <p className="text-brand-text-secondary mt-1">Live tracking of filled and empty inventory across the plant.</p>
            </div>

            
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center mt-6">
                <div className="text-blue-200 mb-5 flex justify-center">
                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-brand-text-primary tracking-tight">Advanced Stock Analytics Coming Soon</h2>
                <p className="text-brand-text-secondary mt-3 max-w-lg mx-auto leading-relaxed">
                    This dedicated module will provide granular visibility into your circulating stock, distinguishing between warehouse inventory, on-route filled bottles, and returned empties.
                </p>
                <button disabled className="mt-6 bg-gray-100 text-gray-400 font-bold py-2.5 px-6 rounded-lg cursor-not-allowed">
                    Module In Development
                </button>
            </div>
        </div>
    );
};

export default Stock;