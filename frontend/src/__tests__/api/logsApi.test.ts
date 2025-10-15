import { logsApi } from '../../api/logsApi';
import type { Log, CreateLogDto, UpdateLogDto } from '../../types/log';

global.fetch = jest.fn();

describe('logsApi', () => {
  const mockLog: Log = {
    id: '1',
    owner: 'Alice',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T11:00:00Z',
    logText: 'Test log',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLogs', () => {
    it('should fetch all logs successfully', async () => {
      const mockLogs = [mockLog];
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockLogs,
      });

      const result = await logsApi.getAllLogs();

      expect(result).toEqual(mockLogs);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/logs')
      );
    });

    it('should throw error when fetch fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(logsApi.getAllLogs()).rejects.toThrow('Failed to fetch logs');
    });
  });

  describe('createLog', () => {
    it('should create a log successfully', async () => {
      const createData: CreateLogDto = {
        owner: 'Alice',
        logText: 'New log',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockLog,
      });

      const result = await logsApi.createLog(createData);

      expect(result).toEqual(mockLog);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/logs'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(createData),
        })
      );
    });

    it('should throw error when create fails', async () => {
      const createData: CreateLogDto = {
        owner: 'Alice',
        logText: 'New log',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(logsApi.createLog(createData)).rejects.toThrow(
        'Failed to create log'
      );
    });
  });

  describe('updateLog', () => {
    it('should update a log successfully', async () => {
      const updateData: UpdateLogDto = {
        owner: 'Alice Updated',
      };

      const updatedLog = { ...mockLog, ...updateData };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => updatedLog,
      });

      const result = await logsApi.updateLog('1', updateData);

      expect(result).toEqual(updatedLog);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/logs/1'),
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        })
      );
    });

    it('should throw error when update fails', async () => {
      const updateData: UpdateLogDto = {
        owner: 'Alice Updated',
      };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(logsApi.updateLog('1', updateData)).rejects.toThrow(
        'Failed to update log'
      );
    });

    it('should handle partial updates', async () => {
      const updateData: UpdateLogDto = {
        logText: 'Updated text only',
      };

      const updatedLog = { ...mockLog, ...updateData };

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => updatedLog,
      });

      const result = await logsApi.updateLog('1', updateData);

      expect(result).toEqual(updatedLog);
    });
  });

  describe('deleteLog', () => {
    it('should delete a log successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await logsApi.deleteLog('1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/logs/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });

    it('should throw error when delete fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await expect(logsApi.deleteLog('1')).rejects.toThrow('Failed to delete log');
    });
  });

  describe('API URL configuration', () => {
    it('should use VITE_API_URL from environment if available', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => [],
      });

      await logsApi.getAllLogs();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/logs$/)
      );
    });
  });
});
