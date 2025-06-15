import { render, screen, within } from '@testing-library/react';
import ComparisonResults from '@/components/ComparisonResults';
import { HexDifference } from '@/components/HexCompare';
import { getByteStyle } from '@/lib/utils';

describe('ComparisonResults component', () => {
  const mockDifferences: HexDifference[] = [
    { offset: 0, byte1: 'AA', byte2: 'AA', type: 'match' },
    { offset: 1, byte1: 'BB', byte2: 'BC', type: 'different' },
    { offset: 2, byte1: 'CC', byte2: null, type: 'removed' },
    { offset: 3, byte1: null, byte2: 'DD', type: 'added' },
  ];

  it('renders the component with title and description', () => {
    render(<ComparisonResults differences={mockDifferences} />);

    expect(screen.getByText('Comparison Results')).toBeInTheDocument();
    expect(
      screen.getByText('Byte-by-byte comparison with highlighted differences'),
    ).toBeInTheDocument();
  });

  it('displays the legend items', () => {
    render(<ComparisonResults differences={mockDifferences} />);

    expect(screen.getByText('Match')).toBeInTheDocument();
    expect(screen.getByText('Different')).toBeInTheDocument();
    expect(screen.getByText('Added')).toBeInTheDocument();
    expect(screen.getByText('Removed')).toBeInTheDocument();
  });

  it('renders both data set sections', () => {
    render(<ComparisonResults differences={mockDifferences} />);
    expect(screen.getByText('Data Set 1:')).toBeInTheDocument();
    expect(screen.getByText('Data Set 2:')).toBeInTheDocument();
  });

  it('displays all bytes with correct styling for Data Set 1', () => {
    render(<ComparisonResults differences={mockDifferences} />);

    const dataset1 = screen.getByText('Data Set 1:').parentElement!;

    // Match
    const matchByte = within(dataset1).getByText('AA');
    expect(matchByte).toHaveClass(getByteStyle('match'));

    // Different
    const differentByte = within(dataset1).getByText('BB');
    expect(differentByte).toHaveClass(getByteStyle('different'));

    // Removed
    const removedByte = within(dataset1).getByText('CC');
    expect(removedByte).toHaveClass(getByteStyle('removed'));

    // Added (should show -- for Data Set 1)
    const addedPlaceholder = within(dataset1).getByText('--');
    expect(addedPlaceholder).toBeInTheDocument();
  });

  it('displays all bytes with correct styling for Data Set 2', () => {
    render(<ComparisonResults differences={mockDifferences} />);

    const dataset2 = screen.getByText('Data Set 2:').parentElement!;

    // Match
    const matchByte = within(dataset2).getByText('AA');
    expect(matchByte).toHaveClass(getByteStyle('match'));

    // Different
    const differentByte = within(dataset2).getByText('BC');
    expect(differentByte).toHaveClass(getByteStyle('different'));

    // Removed (should show -- for Data Set 2)
    const removedPlaceholder = within(dataset2).getByText('--');
    expect(removedPlaceholder).toBeInTheDocument();

    // Added
    const addedByte = within(dataset2).getByText('DD');
    expect(addedByte).toHaveClass(getByteStyle('added'));
  });

  it('shows correct tooltips for each byte', () => {
    render(<ComparisonResults differences={mockDifferences} />);

    // Test Data Set 1 bytes
    const dataset1 = screen.getByText('Data Set 1:').parentElement!;
    expect(within(dataset1).getByText('AA')).toHaveAttribute(
      'title',
      'Offset: 0, Type: match',
    );
    expect(within(dataset1).getByText('BB')).toHaveAttribute(
      'title',
      'Offset: 1, Type: different',
    );
    expect(within(dataset1).getByText('CC')).toHaveAttribute(
      'title',
      'Offset: 2, Type: removed',
    );

    // Test Data Set 2 bytes
    const dataset2 = screen.getByText('Data Set 2:').parentElement!;
    expect(within(dataset2).getByText('AA')).toHaveAttribute(
      'title',
      'Offset: 0, Type: match',
    );
    expect(within(dataset2).getByText('BC')).toHaveAttribute(
      'title',
      'Offset: 1, Type: different',
    );
    expect(within(dataset2).getByText('DD')).toHaveAttribute(
      'title',
      'Offset: 3, Type: added',
    );
  });

  it('handles empty differences array', () => {
    render(<ComparisonResults differences={[]} />);

    expect(screen.getByText('Data Set 1:')).toBeInTheDocument();
    expect(screen.getByText('Data Set 2:')).toBeInTheDocument();

    const dataset1 = screen.getByText('Data Set 1:').parentElement!;
    const dataset2 = screen.getByText('Data Set 2:').parentElement!;

    expect(within(dataset1).queryByText(/[A-F0-9]{2}/)).not.toBeInTheDocument();
    expect(within(dataset2).queryByText(/[A-F0-9]{2}/)).not.toBeInTheDocument();
  });
});
