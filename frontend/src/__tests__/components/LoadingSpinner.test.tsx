import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('should render screen reader text', () => {
    render(<LoadingSpinner />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should have minimum height for proper display', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('[role="status"]');
    expect(spinner).toHaveClass('min-h-[400px]');
  });

  it('should center the spinner', () => {
    const { container } = render(<LoadingSpinner />);

    const spinner = container.querySelector('[role="status"]');
    expect(spinner).toHaveClass('flex');
    expect(spinner).toHaveClass('items-center');
    expect(spinner).toHaveClass('justify-center');
  });
});
