import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AddLogModal } from '../../components/AddLogModal';

describe('AddLogModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <AddLogModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.queryByText('Create New Log')).not.toBeInTheDocument();
  });

  it('should render when isOpen is true', () => {
    render(
      <AddLogModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Create New Log')).toBeInTheDocument();
    expect(screen.getByLabelText(/owner/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/log text/i)).toBeInTheDocument();
  });

  it('should show validation errors when submitting empty form', async () => {
    render(
      <AddLogModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create log/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Owner is required')).toBeInTheDocument();
      expect(screen.getByText('Log text is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <AddLogModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const ownerInput = screen.getByLabelText(/owner/i);
    const logTextInput = screen.getByLabelText(/log text/i);
    const submitButton = screen.getByRole('button', { name: /create log/i });

    await user.type(ownerInput, 'Test Owner');
    await user.type(logTextInput, 'Test log message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith('Test Owner', 'Test log message');
    });
  });

  it('should call onClose when clicking cancel button', async () => {
    const user = userEvent.setup();

    render(
      <AddLogModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should disable inputs and show loading state when isCreating', () => {
    render(
      <AddLogModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        isCreating={true}
      />
    );

    expect(screen.getByLabelText(/owner/i)).toBeDisabled();
    expect(screen.getByLabelText(/log text/i)).toBeDisabled();
    expect(screen.getByText('Creating...')).toBeInTheDocument();
  });

  it('should clear errors when user types in inputs', async () => {
    const user = userEvent.setup();

    render(
      <AddLogModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create log/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Owner is required')).toBeInTheDocument();
    });

    const ownerInput = screen.getByLabelText(/owner/i);
    await user.type(ownerInput, 'Test');

    await waitFor(() => {
      expect(screen.queryByText('Owner is required')).not.toBeInTheDocument();
    });
  });
});
