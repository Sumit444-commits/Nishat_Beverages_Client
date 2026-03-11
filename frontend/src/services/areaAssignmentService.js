import axios from 'axios';

// Environment variable setup remains the same
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Service to handle all API calls related to Area Assignments.
 * TypeScript interfaces have been removed; data is now handled as plain JS objects.
 */
export const areaAssignmentService = {
  // Get all area assignments
  getAll: async (params) => {
    // Generics removed from api.get
    const response = await api.get('/area-assignments', { 
      params: {
        active: params?.active,
        salesmanId: params?.salesmanId,
        search: params?.search
      }
    });
    return response.data;
  },

  // Create new area
  create: async (data) => {
    // Generics removed from api.post
    const response = await api.post('/area-assignments', data);
    return response.data;
  },

  // Update area
  update: async (id, data) => {
    // Generics removed from api.put
    const response = await api.put(`/area-assignments/${id}`, data);
    return response.data;
  },

  // Delete area
  delete: async (id) => {
    const response = await api.delete(`/area-assignments/${id}`);
    return response.data;
  },

  // Get area statistics
  getStats: async () => {
    const response = await api.get('/area-assignments/stats/summary');
    return response.data;
  },
};