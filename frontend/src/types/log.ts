export interface Log {
  id: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  logText: string;
}

export interface CreateLogDto {
  owner: string;
  logText: string;
}

export interface UpdateLogDto {
  owner?: string;
  logText?: string;
}
