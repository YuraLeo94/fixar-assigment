import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EditableCell } from '../../components/EditableCell';

describe('EditableCell', () => {
  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display value in view mode', () => {
    render(<EditableCell value="Test Value" onSave={mockOnSave} />);

    expect(screen.getByText('Test Value')).toBeInTheDocument();
  });

  it('should show placeholder when value is empty', () => {
    render(<EditableCell value="" onSave={mockOnSave} />);

    expect(screen.getByText('Click to edit')).toBeInTheDocument();
  });

  it('should enter edit mode when clicked', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Test Value" onSave={mockOnSave} placeholder="Owner" />);

    const button = screen.getByRole('button', { name: /edit owner/i });
    await user.click(button);

    expect(screen.getByRole('textbox', { name: /edit field/i })).toBeInTheDocument();
  });

  it('should call onSave with new value when Enter is pressed', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Old Value" onSave={mockOnSave} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New Value');
    await user.keyboard('{Enter}');

    expect(mockOnSave).toHaveBeenCalledWith('New Value');
  });

  it('should call onSave when input is blurred', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Old Value" onSave={mockOnSave} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'New Value');
    fireEvent.blur(input);

    expect(mockOnSave).toHaveBeenCalledWith('New Value');
  });

  it('should cancel edit when Escape is pressed', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Original Value" onSave={mockOnSave} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Changed Value');
    await user.keyboard('{Escape}');

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(screen.getByText('Original Value')).toBeInTheDocument();
  });

  it('should not call onSave if value is unchanged', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Same Value" onSave={mockOnSave} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should not call onSave if value is empty or whitespace', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Original" onSave={mockOnSave} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '   ');
    fireEvent.blur(input);

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should render textarea in multiline mode', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Multiline Text" onSave={mockOnSave} multiline />);

    const button = screen.getByRole('button');
    await user.click(button);

    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('should save multiline text with Ctrl+Enter', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Old Text" onSave={mockOnSave} multiline />);

    const button = screen.getByRole('button');
    await user.click(button);

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'New Text');
    await user.keyboard('{Control>}{Enter}{/Control}');

    expect(mockOnSave).toHaveBeenCalledWith('New Text');
  });

  it('should not save multiline text with Enter alone', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Old Text" onSave={mockOnSave} multiline />);

    const button = screen.getByRole('button');
    await user.click(button);

    const textarea = screen.getByRole('textbox');
    await user.clear(textarea);
    await user.type(textarea, 'New Text{Enter}More Text');

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should show keyboard hints for single-line mode', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Test" onSave={mockOnSave} />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Press Enter to save, Esc to cancel')).toBeInTheDocument();
  });

  it('should show keyboard hints for multiline mode', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Test" onSave={mockOnSave} multiline />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(screen.getByText('Press Ctrl+Enter to save, Esc to cancel')).toBeInTheDocument();
  });

  it('should trim whitespace from saved value', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Old Value" onSave={mockOnSave} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '  Trimmed Value  ');
    fireEvent.blur(input);

    expect(mockOnSave).toHaveBeenCalledWith('Trimmed Value');
  });

  it('should focus and select input text when entering edit mode', async () => {
    const user = userEvent.setup();

    render(<EditableCell value="Select Me" onSave={mockOnSave} />);

    const button = screen.getByRole('button');
    await user.click(button);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveFocus();
  });
});
