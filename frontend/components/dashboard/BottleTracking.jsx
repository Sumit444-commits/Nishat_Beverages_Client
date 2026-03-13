import React from 'react';

const BottleTracking = () => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Bottle Tracking</h1>
                <p className="text-brand-text-secondary mt-1">Monitor the location and lifecycle of reusable water bottles.</p>
            </div>

            
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center mt-6">
                <div className="text-blue-200 mb-4 flex justify-center">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-brand-text-primary">Feature Coming Soon</h2>
                <p className="text-brand-text-secondary mt-3 max-w-md mx-auto leading-relaxed">
                    The advanced bottle tracking system is currently under development. Soon, you will be able to track individual bottle lifecycles and exact customer holdings in real-time.
                </p>
            </div>
        </div>
    );
};

export default BottleTracking;
