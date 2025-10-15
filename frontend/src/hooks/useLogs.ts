import { useState, useEffect, useCallback } from 'react';
import { logsApi } from '../api/logsApi';
import { useToast } from '../contexts/ToastContext';
import type { Log, CreateLogDto, UpdateLogDto } from '../types/log';

export function useLogs() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await logsApi.getAllLogs();
      setLogs(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch logs';
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const createLog = useCallback(
    async (data: CreateLogDto) => {
      try {
        const newLog = await logsApi.createLog(data);
        setLogs((prev) => [...prev, newLog]);
        showToast('Log created successfully', 'success');
        return newLog;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create log';
        showToast(message, 'error');
        throw err;
      }
    },
    [showToast]
  );

  const updateLog = useCallback(
    async (id: string, data: UpdateLogDto) => {
      try {
        const updatedLog = await logsApi.updateLog(id, data);
        setLogs((prev) =>
          prev.map((log) => (log.id === id ? updatedLog : log))
        );
        showToast('Log updated successfully', 'success');
        return updatedLog;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update log';
        showToast(message, 'error');
        throw err;
      }
    },
    [showToast]
  );

  const deleteLog = useCallback(
    async (id: string) => {
      try {
        await logsApi.deleteLog(id);
        setLogs((prev) => prev.filter((log) => log.id !== id));
        showToast('Log deleted successfully', 'success');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete log';
        showToast(message, 'error');
        throw err;
      }
    },
    [showToast]
  );

  return {
    logs,
    loading,
    error,
    fetchLogs,
    createLog,
    updateLog,
    deleteLog,
  };
}
