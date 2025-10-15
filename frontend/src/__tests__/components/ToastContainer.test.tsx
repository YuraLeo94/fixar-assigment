import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastContainer } from '../../components/ToastContainer';
import * as ToastContext from '../../contexts/ToastContext';

describe('ToastContainer', () => {
  const mockRemoveToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render empty container when there are no toasts', () => {
    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
    });

    const { container } = render(<ToastContainer />);

    const toastContainer = container.querySelector('[aria-live="assertive"]');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer?.children.length).toBe(0);
  });

  it('should render success toast', () => {
    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [{ id: '1', message: 'Success message', type: 'success' }],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should render error toast', () => {
    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [{ id: '2', message: 'Error message', type: 'error' }],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should render multiple toasts', () => {
    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [
        { id: '1', message: 'First message', type: 'success' },
        { id: '2', message: 'Second message', type: 'error' },
        { id: '3', message: 'Third message', type: 'success' },
      ],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    expect(screen.getByText('First message')).toBeInTheDocument();
    expect(screen.getByText('Second message')).toBeInTheDocument();
    expect(screen.getByText('Third message')).toBeInTheDocument();
  });

  it('should call removeToast when close button is clicked', async () => {
    const user = userEvent.setup();

    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [{ id: 'toast-1', message: 'Test message', type: 'success' }],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    const closeButton = screen.getByRole('button', { name: /close notification/i });
    await user.click(closeButton);

    expect(mockRemoveToast).toHaveBeenCalledWith('toast-1');
  });

  it('should have proper accessibility attributes', () => {
    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [{ id: '1', message: 'Test message', type: 'success' }],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
    });

    const { container } = render(<ToastContainer />);

    const toastContainer = container.querySelector('[aria-live="assertive"]');
    expect(toastContainer).toHaveAttribute('aria-atomic', 'true');

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
  });

  it('should apply success styling for success toasts', () => {
    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [{ id: '1', message: 'Success', type: 'success' }],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-green-50');
    expect(toast).toHaveClass('border-green-200');
    expect(toast).toHaveClass('text-green-800');
  });

  it('should apply error styling for error toasts', () => {
    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [{ id: '1', message: 'Error', type: 'error' }],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-red-50');
    expect(toast).toHaveClass('border-red-200');
    expect(toast).toHaveClass('text-red-800');
  });

  it('should call removeToast for each toast independently', async () => {
    const user = userEvent.setup();

    jest.spyOn(ToastContext, 'useToast').mockReturnValue({
      toasts: [
        { id: 'toast-1', message: 'First', type: 'success' },
        { id: 'toast-2', message: 'Second', type: 'error' },
      ],
      addToast: jest.fn(),
      removeToast: mockRemoveToast,
    });

    render(<ToastContainer />);

    const closeButtons = screen.getAllByRole('button', { name: /close notification/i });
    await user.click(closeButtons[0]);

    expect(mockRemoveToast).toHaveBeenCalledWith('toast-1');
    expect(mockRemoveToast).toHaveBeenCalledTimes(1);
  });
});
