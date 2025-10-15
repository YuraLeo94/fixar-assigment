import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../../components/Pagination';

describe('Pagination', () => {
  const mockOnPageChange = jest.fn();
  const mockOnPrevious = jest.fn();
  const mockOnNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={false}
        hasPreviousPage={false}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render pagination with multiple pages', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && /Page.*1.*of.*5/i.test(element.textContent || '');
    })).toBeInTheDocument();

    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
  });

  it('should call onNext when next button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    const nextButtons = screen.getAllByLabelText('Next page');
    await user.click(nextButtons[0]);

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('should call onPrevious when previous button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    const previousButtons = screen.getAllByLabelText('Previous page');
    await user.click(previousButtons[0]);

    expect(mockOnPrevious).toHaveBeenCalledTimes(1);
  });

  it('should call onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    const page3Button = screen.getByLabelText('Page 3');
    await user.click(page3Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('should disable previous button when hasPreviousPage is false', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    const previousButtons = screen.getAllByLabelText('Previous page');
    previousButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should disable next button when hasNextPage is false', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={false}
        hasPreviousPage={true}
      />
    );

    const nextButtons = screen.getAllByLabelText('Next page');
    nextButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('should highlight current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    const currentPageButton = screen.getByLabelText('Page 3');
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
  });

  it('should show ellipsis for many pages', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={20}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  it('should render mobile view with Previous/Next text buttons', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    const mobileButtons = screen.getAllByRole('button', { name: /Previous|Next/ });
    expect(mobileButtons.length).toBeGreaterThanOrEqual(2);
  });

  it('should show all page numbers when total pages is 5 or less', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={false}
      />
    );

    expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
  });

  it('should render desktop view with page info', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={10}
        onPageChange={mockOnPageChange}
        onPrevious={mockOnPrevious}
        onNext={mockOnNext}
        hasNextPage={true}
        hasPreviousPage={true}
      />
    );

    expect(screen.getByText((content, element) => {
      return element?.tagName.toLowerCase() === 'p' && /Page.*3.*of.*10/i.test(element.textContent || '');
    })).toBeInTheDocument();
  });
});
