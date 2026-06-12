import { useState, useEffect, useCallback } from 'react';
import { meetingsAPI, checkServerHealth } from '../api/meetingsAPI';

export const useMeetingStorage = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverOnline, setServerOnline] = useState(false);

  // Check server health on mount
  useEffect(() => {
    const checkHealth = async () => {
      const isOnline = await checkServerHealth();
      setServerOnline(isOnline);
    };
    checkHealth();
  }, []);

  // Load all meetings
  const loadMeetings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await meetingsAPI.getAll();
      setMeetings(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load meetings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save meeting to database
  const saveMeeting = useCallback(async (meetingData) => {
    try {
      setLoading(true);
      const result = await meetingsAPI.create(meetingData);
      await loadMeetings(); // Reload to get the new meeting with ID
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to save meeting:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadMeetings]);

  // Update existing meeting
  const updateMeeting = useCallback(async (id, meetingData) => {
    try {
      setLoading(true);
      const result = await meetingsAPI.update(id, meetingData);
      await loadMeetings(); // Reload to get updated data
      setError(null);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Failed to update meeting:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadMeetings]);

  // Delete meeting
  const deleteMeeting = useCallback(async (id) => {
    try {
      setLoading(true);
      await meetingsAPI.delete(id);
      await loadMeetings(); // Reload after deletion
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to delete meeting:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadMeetings]);

  // Get statistics
  const getStatistics = useCallback(async () => {
    try {
      return await meetingsAPI.getStats();
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      throw err;
    }
  }, []);

  return {
    meetings,
    loading,
    error,
    serverOnline,
    loadMeetings,
    saveMeeting,
    updateMeeting,
    deleteMeeting,
    getStatistics,
  };
};
