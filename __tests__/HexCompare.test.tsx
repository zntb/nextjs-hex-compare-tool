import { render, screen } from '@testing-library/react';
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import HexCompare from '@/components/HexCompare';

describe('HexCompare component', () => {
  it('renders title and input areas', () => {
    render(<HexCompare />);

    expect(screen.getByText('HEX Data Comparison Tool')).toBeInTheDocument();
    expect(screen.getByText('HEX Data Set 1')).toBeInTheDocument();
    expect(screen.getByText('HEX Data Set 2')).toBeInTheDocument();
  });

  it('enables the Compare button only when both inputs have value', async () => {
    render(<HexCompare />);
    const compareButton = screen.getByRole('button', {
      name: /compare hex data/i,
    });

    // Find textareas by their placeholder text
    const textareas = screen.getAllByPlaceholderText(/enter hex data/i);
    const [textarea1, textarea2] = textareas;

    expect(compareButton).toBeDisabled();

    await userEvent.type(textarea1, 'AABBCC');
    await userEvent.type(textarea2, 'AABBCC');
    expect(compareButton).toBeEnabled();
  });

  it('shows comparison result when data differs', async () => {
    render(<HexCompare />);

    const textareas = screen.getAllByPlaceholderText(/enter hex data/i);
    const [textarea1, textarea2] = textareas;
    const compareButton = screen.getByRole('button', {
      name: /compare hex data/i,
    });

    await userEvent.clear(textarea1);
    await userEvent.type(textarea1, 'AABBCC');
    await userEvent.clear(textarea2);
    await userEvent.type(textarea2, 'AABBDD');

    await userEvent.click(compareButton);

    // Wait for results to appear
    const resultsSection = await screen.findByTestId('results-section');

    // Use within properly by wrapping the section first
    const withinResults = within(resultsSection);

    // Now use the scoped queries
    expect(
      withinResults.getByText(/comparison statistics/i),
    ).toBeInTheDocument();

    // Match the exact "Different" text in the stats section
    expect(withinResults.getByText(/Different: \d+/)).toBeInTheDocument();

    expect(withinResults.getByText(/data set 1:/i)).toBeInTheDocument();
    expect(withinResults.getByText(/data set 2:/i)).toBeInTheDocument();
  });

  it('clears inputs when "Clear All" is clicked', async () => {
    render(<HexCompare />);
    const [textarea1, textarea2] =
      screen.getAllByPlaceholderText(/enter hex data/i);
    const clearButton = screen.getByRole('button', { name: /clear all/i });

    await userEvent.type(textarea1, 'ABC');
    await userEvent.type(textarea2, 'DEF');
    await userEvent.click(clearButton);

    expect(textarea1).toHaveValue('');
    expect(textarea2).toHaveValue('');
  });
});
