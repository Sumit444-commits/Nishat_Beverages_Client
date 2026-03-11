import { useState, useEffect } from 'react';
import axios from 'axios';

// Pulling API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom hook to fetch and manage customer data.
 * @returns {Object} { customers, loading, error }
 */
export const useCustomers = () => {
    // TypeScript generics <Customer[]> and <string | null> removed
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(`${API_URL}/customers`);
                
                if (response.data.success) {
                    // Format customers data to ensure numeric IDs for component compatibility
                    // Type annotations (c: any, index: number) removed
                    const formattedCustomers = response.data.data.map((c, index) => ({
                        ...c,
                        id: c.id || index + 1
                    }));
                    setCustomers(formattedCustomers);
                }
            } catch (err) {
                setError('Failed to fetch customers');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    return { customers, loading, error };
};