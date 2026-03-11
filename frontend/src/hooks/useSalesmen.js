import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom hook to fetch and manage salesmen data.
 * @returns {Object} { salesmen, loading, error }
 */
export const useSalesmen = () => {
    // TypeScript types removed from useState
    const [salesmen, setSalesmen] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSalesmen = async () => {
            try {
                const response = await axios.get(`${API_URL}/salesmen`);
                if (response.data.success) {
                    // Format salesmen data to ensure numeric IDs
                    // Types removed from (s, index) parameters
                    const formattedSalesmen = response.data.data.map((s, index) => ({
                        ...s,
                        id: s.id || index + 1
                    }));
                    setSalesmen(formattedSalesmen);
                }
            } catch (err) {
                setError('Failed to fetch salesmen');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesmen();
    }, []);

    return { salesmen, loading, error };
};