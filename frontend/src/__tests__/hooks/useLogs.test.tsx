import { renderHook, act, waitFor } from '@testing-library/react';
import { useLogs } from '../../hooks/useLogs';
import { logsApi } from '../../api/logsApi';
import * as ToastContext from '../../contexts/ToastContext';
import type { Log } from '../../types/log';

// Mock the API
jest.mock('../../api/logsApi');

describe('useLogs', () => {
  const mockShowToast = jest.fn();
  const mockLogs: Log[] = [
    {
      id: '1',
      owner: 'Alice',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T11:00:00Z',
      logText: 'First log',
    },
    {
      id: '2',
      owner: 'Bob',
      createdAt: '2025-01-15T12:00:00Z',
      updatedAt: '2025-01-15T13:00:00Z',
      logText: 'Second log',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [],
      addToast: jest.fn(),
      removeToast: jest.fn(),
      showToast: mockShowToast,
    });
  });

  it('should fetch logs on mount', async () => {
    (logsApi.getAllLogs as jest.Mock).mockResolvedValue(mockLogs);

    const { result } = renderHook(() => useLogs());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.logs).toEqual(mockLogs);
    expect(result.current.error).toBe(null);
    expect(logsApi.getAllLogs).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Network error';
    (logsApi.getAllLogs as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'error');
  });

  it('should create a new log', async () => {
    (logsApi.getAllLogs as jest.Mock).mockResolvedValue(mockLogs);
    const newLog: Log = {
      id: '3',
      owner: 'Charlie',
      createdAt: '2025-01-15T14:00:00Z',
      updatedAt: '2025-01-15T14:00:00Z',
      logText: 'New log',
    };
    (logsApi.createLog as jest.Mock).mockResolvedValue(newLog);

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.createLog({ owner: 'Charlie', logText: 'New log' });
    });

    expect(result.current.logs).toHaveLength(3);
    expect(result.current.logs[2]).toEqual(newLog);
    expect(mockShowToast).toHaveBeenCalledWith('Log created successfully', 'success');
  });

  it('should handle create error', async () => {
    (logsApi.getAllLogs as jest.Mock).mockResolvedValue(mockLogs);
    const errorMessage = 'Failed to create';
    (logsApi.createLog as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(async () => {
      await act(async () => {
        await result.current.createLog({ owner: 'Test', logText: 'Test log' });
      });
    }).rejects.toThrow();

    expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'error');
    expect(result.current.logs).toHaveLength(2);
  });

  it('should update a log', async () => {
    (logsApi.getAllLogs as jest.Mock).mockResolvedValue(mockLogs);
    const updatedLog: Log = {
      ...mockLogs[0],
      owner: 'Alice Updated',
      updatedAt: '2025-01-15T15:00:00Z',
    };
    (logsApi.updateLog as jest.Mock).mockResolvedValue(updatedLog);

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.updateLog('1', { owner: 'Alice Updated' });
    });

    expect(result.current.logs[0]).toEqual(updatedLog);
    expect(mockShowToast).toHaveBeenCalledWith('Log updated successfully', 'success');
  });

  it('should handle update error', async () => {
    (logsApi.getAllLogs as jest.Mock).mockResolvedValue(mockLogs);
    const errorMessage = 'Failed to update';
    (logsApi.updateLog as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(async () => {
      await act(async () => {
        await result.current.updateLog('1', { owner: 'New Name' });
      });
    }).rejects.toThrow();

    expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'error');
  });

  it('should delete a log', async () => {
    (logsApi.getAllLogs as jest.Mock).mockResolvedValue(mockLogs);
    (logsApi.deleteLog as jest.Mock).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.logs).toHaveLength(2);

    await act(async () => {
      await result.current.deleteLog('1');
    });

    expect(result.current.logs).toHaveLength(1);
    expect(result.current.logs.find((log) => log.id === '1')).toBeUndefined();
    expect(mockShowToast).toHaveBeenCalledWith('Log deleted successfully', 'success');
  });

  it('should handle delete error', async () => {
    (logsApi.getAllLogs as jest.Mock).mockResolvedValue(mockLogs);
    const errorMessage = 'Failed to delete';
    (logsApi.deleteLog as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await expect(async () => {
      await act(async () => {
        await result.current.deleteLog('1');
      });
    }).rejects.toThrow();

    expect(mockShowToast).toHaveBeenCalledWith(errorMessage, 'error');
    expect(result.current.logs).toHaveLength(2);
  });

  it('should manually fetch logs', async () => {
    (logsApi.getAllLogs as jest.Mock).mockResolvedValue(mockLogs);

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(logsApi.getAllLogs).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.fetchLogs();
    });

    expect(logsApi.getAllLogs).toHaveBeenCalledTimes(2);
  });

  it('should handle non-Error objects in catch blocks', async () => {
    (logsApi.getAllLogs as jest.Mock).mockRejectedValue('String error');

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch logs');
    expect(mockShowToast).toHaveBeenCalledWith('Failed to fetch logs', 'error');
  });

  it('should set loading state correctly during operations', async () => {
    (logsApi.getAllLogs as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockLogs), 100))
    );

    const { result } = renderHook(() => useLogs());

    expect(result.current.loading).toBe(true);

    await waitFor(
      () => {
        expect(result.current.loading).toBe(false);
      },
      { timeout: 200 }
    );

    expect(result.current.logs).toEqual(mockLogs);
  });

  it('should clear error on successful fetch', async () => {
    (logsApi.getAllLogs as jest.Mock)
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce(mockLogs);

    const { result } = renderHook(() => useLogs());

    await waitFor(() => {
      expect(result.current.error).toBe('First error');
    });

    await act(async () => {
      await result.current.fetchLogs();
    });

    await waitFor(() => {
      expect(result.current.error).toBe(null);
    });

    expect(result.current.logs).toEqual(mockLogs);
  });
});
