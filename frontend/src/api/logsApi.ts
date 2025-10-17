import type { Log, CreateLogDto, UpdateLogDto } from '../types/log';

// API base URL - works in dev (Vite proxy), prod (Vercel), and tests
const API_BASE_URL = '/api';

export const logsApi = {
  async getAllLogs(): Promise<Log[]> {
    const response = await fetch(`${API_BASE_URL}/logs`);
    if (!response.ok) {
      throw new Error('Failed to fetch logs');
    }
    return response.json();
  },

  async createLog(data: CreateLogDto): Promise<Log> {
    const response = await fetch(`${API_BASE_URL}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create log');
    }
    return response.json();
  },

  async updateLog(id: string, data: UpdateLogDto): Promise<Log> {
    const response = await fetch(`${API_BASE_URL}/logs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update log');
    }
    return response.json();
  },

  async deleteLog(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/logs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete log');
    }
  },
};
