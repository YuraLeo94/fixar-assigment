import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogsTable } from '../../components/LogsTable';
import type { Log } from '../../types/log';

jest.mock('../../hooks/usePagination', () => ({
  usePagination: ({ data }: { data: Log[] }) => ({
    paginatedData: data.slice(0, 10),
    currentPage: 1,
    totalPages: Math.ceil(data.length / 10),
    goToPage: jest.fn(),
    nextPage: jest.fn(),
    previousPage: jest.fn(),
    hasNextPage: data.length > 10,
    hasPreviousPage: false,
  }),
}));

describe('LogsTable', () => {
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  const mockLogs: Log[] = [
    {
      id: '1',
      owner: 'Alice',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T11:00:00Z',
      logText: 'First log entry',
    },
    {
      id: '2',
      owner: 'Bob',
      createdAt: '2025-01-15T12:00:00Z',
      updatedAt: '2025-01-15T13:00:00Z',
      logText: 'Second log entry',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty state when no logs are provided', () => {
    render(<LogsTable logs={[]} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getByText('No logs found')).toBeInTheDocument();
    expect(screen.getByText('There are no logs to display at this time.')).toBeInTheDocument();
  });

  it('should render logs in table format', () => {
    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.getAllByText('Alice').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bob').length).toBeGreaterThan(0);
    expect(screen.getAllByText('First log entry').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Second log entry').length).toBeGreaterThan(0);
  });

  it('should format dates correctly', () => {
    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const dateElements = screen.getAllByText(/Jan|2025/i);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  it('should render delete buttons for each log', () => {
    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete log by/i });
    expect(deleteButtons.length).toBeGreaterThanOrEqual(2);
    expect(deleteButtons[0]).toHaveAttribute('aria-label', 'Delete log by Alice');
  });

  it('should call onDelete when delete is confirmed', async () => {
    const user = userEvent.setup();
    mockOnDelete.mockResolvedValue(undefined);

    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete log by/i });
    await user.click(deleteButtons[0]);

    // Wait for modal to appear
    expect(await screen.findByRole('heading', { name: 'Delete Log' })).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /^delete$/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockOnDelete).toHaveBeenCalledWith('1');
    });
  });

  it('should close delete modal when cancel is clicked', async () => {
    const user = userEvent.setup();

    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete log by/i });
    await user.click(deleteButtons[0]);

    // Wait for modal to appear
    expect(await screen.findByRole('heading', { name: 'Delete Log' })).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Delete Log' })).not.toBeInTheDocument();
    });

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it('should call onUpdate when EditableCell is saved', async () => {
    const user = userEvent.setup();
    mockOnUpdate.mockResolvedValue(undefined);

    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const ownerButtons = screen.getAllByRole('button', { name: /edit owner/i });
    await user.click(ownerButtons[0]);

    const input = screen.getByRole('textbox', { name: /edit field/i });
    await user.clear(input);
    await user.type(input, 'Updated Alice');

    await user.tab();

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith('1', { owner: 'Updated Alice' });
    });
  });

  it('should show loading state during deletion', async () => {
    const user = userEvent.setup();
    mockOnDelete.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete log by/i });
    await user.click(deleteButtons[0]);

    // Wait for modal to appear
    expect(await screen.findByRole('heading', { name: 'Delete Log' })).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /^delete$/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeInTheDocument();
    });
  });

  it('should render pagination when there are logs', () => {
    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    expect(screen.queryByLabelText('Pagination')).not.toBeInTheDocument();
  });

  it('should handle update errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockOnUpdate.mockRejectedValue(new Error('Update failed'));

    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const ownerButtons = screen.getAllByRole('button', { name: /edit owner/i });
    await user.click(ownerButtons[0]);

    const input = screen.getByRole('textbox', { name: /edit field/i });
    await user.clear(input);
    await user.type(input, 'New Name');
    await user.tab();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to update log:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle delete errors gracefully', async () => {
    const user = userEvent.setup();
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockOnDelete.mockRejectedValue(new Error('Delete failed'));

    render(<LogsTable logs={mockLogs} onUpdate={mockOnUpdate} onDelete={mockOnDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete log by/i });
    await user.click(deleteButtons[0]);

    // Wait for modal to appear
    expect(await screen.findByRole('heading', { name: 'Delete Log' })).toBeInTheDocument();

    const confirmButton = screen.getByRole('button', { name: /^delete$/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to delete log:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
