import { renderHook, act, waitFor, render, screen } from '@testing-library/react';
import { ToastProvider, useToast } from '../../contexts/ToastContext';

describe('ToastContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('ToastProvider', () => {
    it('should render children', () => {
      render(
        <ToastProvider>
          <div>Test Child</div>
        </ToastProvider>
      );

      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
  });

  describe('useToast', () => {
    it('should throw error when used outside ToastProvider', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useToast());
      }).toThrow('useToast must be used within a ToastProvider');

      consoleErrorSpy.mockRestore();
    });

    it('should provide toast context when inside ToastProvider', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      expect(result.current).toHaveProperty('toasts');
      expect(result.current).toHaveProperty('showToast');
      expect(result.current).toHaveProperty('removeToast');
      expect(result.current.toasts).toEqual([]);
    });

    it('should add a toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.showToast('Test message', 'success');
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0]).toMatchObject({
        message: 'Test message',
        type: 'success',
      });
      expect(result.current.toasts[0]).toHaveProperty('id');
    });

    it('should add multiple toasts', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.showToast('First message', 'success');
        result.current.showToast('Second message', 'error');
        result.current.showToast('Third message', 'success');
      });

      expect(result.current.toasts).toHaveLength(3);
      expect(result.current.toasts[0].message).toBe('First message');
      expect(result.current.toasts[1].message).toBe('Second message');
      expect(result.current.toasts[2].message).toBe('Third message');
    });

    it('should remove a toast manually', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.showToast('Test message', 'success');
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.removeToast(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });

    it('should auto-remove toast after 3 seconds', async () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.showToast('Test message', 'success');
      });

      expect(result.current.toasts).toHaveLength(1);

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(result.current.toasts).toHaveLength(0);
      });
    });

    it('should handle multiple toasts with auto-removal', async () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.showToast('First message', 'success');
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      act(() => {
        result.current.showToast('Second message', 'error');
      });

      expect(result.current.toasts).toHaveLength(2);

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].message).toBe('Second message');
      });

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(result.current.toasts).toHaveLength(0);
      });
    });

    it('should generate unique IDs for each toast', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.showToast('First', 'success');
        result.current.showToast('Second', 'success');
        result.current.showToast('Third', 'success');
      });

      const ids = result.current.toasts.map((toast) => toast.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });

    it('should support both success and error types', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.showToast('Success message', 'success');
        result.current.showToast('Error message', 'error');
      });

      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[1].type).toBe('error');
    });

    it('should not remove wrong toast when ID does not match', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.showToast('Test message', 'success');
      });

      act(() => {
        result.current.removeToast('non-existent-id');
      });

      expect(result.current.toasts).toHaveLength(1);
    });

    it('should handle removing toast from multiple toasts', () => {
      const { result } = renderHook(() => useToast(), {
        wrapper: ToastProvider,
      });

      act(() => {
        result.current.showToast('First', 'success');
        result.current.showToast('Second', 'error');
        result.current.showToast('Third', 'success');
      });

      const secondToastId = result.current.toasts[1].id;

      act(() => {
        result.current.removeToast(secondToastId);
      });

      expect(result.current.toasts).toHaveLength(2);
      expect(result.current.toasts[0].message).toBe('First');
      expect(result.current.toasts[1].message).toBe('Third');
    });
  });
});
