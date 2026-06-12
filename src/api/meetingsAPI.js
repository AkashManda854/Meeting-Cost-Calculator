// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Meetings API
export const meetingsAPI = {
  // Get all meetings
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/meetings`);
    if (!response.ok) throw new Error('Failed to fetch meetings');
    return response.json();
  },

  // Get single meeting
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`);
    if (!response.ok) throw new Error('Failed to fetch meeting');
    return response.json();
  },

  // Create new meeting
  create: async (meetingData) => {
    const response = await fetch(`${API_BASE_URL}/meetings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData),
    });
    if (!response.ok) throw new Error('Failed to create meeting');
    return response.json();
  },

  // Update meeting
  update: async (id, meetingData) => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meetingData),
    });
    if (!response.ok) throw new Error('Failed to update meeting');
    return response.json();
  },

  // Delete meeting
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/meetings/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete meeting');
    return response.json();
  },

  // Get statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/statistics`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  },
};

// Health check
export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
