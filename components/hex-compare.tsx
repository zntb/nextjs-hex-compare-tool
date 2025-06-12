'use client';

import { useState, useMemo, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, FileText, RotateCcw } from 'lucide-react';

interface HexDifference {
  offset: number;
  byte1: string | null;
  byte2: string | null;
  type: 'match' | 'different' | 'added' | 'removed';
}

interface Stats {
  total: number;
  matches: number;
  different: number;
  added: number;
  removed: number;
}

// Memoized byte style function
const getByteStyle = (type: HexDifference['type']): string => {
  switch (type) {
    case 'match':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'different':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'added':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'removed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
};

// Memoized hex byte component
const HexByte = memo<{
  diff: HexDifference;
  dataSet: 1 | 2;
  index: number;
}>(({ diff, dataSet }) => {
  const byte = dataSet === 1 ? diff.byte1 : diff.byte2;

  return (
    <span
      className={`px-2 py-1 rounded border text-xs ${getByteStyle(diff.type)}`}
      title={`Offset: ${diff.offset}, Type: ${diff.type}`}
    >
      {byte || '--'}
    </span>
  );
});

HexByte.displayName = 'HexByte';

// Memoized statistics component
const StatsBadges = memo<{ stats: Stats }>(({ stats }) => (
  <div className='flex flex-wrap gap-4'>
    <Badge variant='outline' className='bg-gray-50'>
      Total: {stats.total}
    </Badge>
    <Badge variant='outline' className='bg-green-50 text-green-700'>
      Matches: {stats.matches}
    </Badge>
    <Badge variant='outline' className='bg-red-50 text-red-700'>
      Different: {stats.different}
    </Badge>
    <Badge variant='outline' className='bg-blue-50 text-blue-700'>
      Added: {stats.added}
    </Badge>
    <Badge variant='outline' className='bg-gray-50 text-gray-700'>
      Removed: {stats.removed}
    </Badge>
  </div>
));

StatsBadges.displayName = 'StatsBadges';

// Memoized hex data display component
const HexDataDisplay = memo<{
  differences: HexDifference[];
  dataSet: 1 | 2;
  title: string;
}>(({ differences, dataSet, title }) => (
  <div>
    <h4 className='font-medium mb-2'>{title}:</h4>
    <div className='flex flex-wrap gap-1 p-3 bg-gray-50 rounded-lg font-mono text-sm'>
      {differences.map((diff, index) => (
        <HexByte
          key={`set${dataSet}-${index}`}
          diff={diff}
          dataSet={dataSet}
          index={index}
        />
      ))}
    </div>
  </div>
));

HexDataDisplay.displayName = 'HexDataDisplay';

export default function HexCompare() {
  const [hex1, setHex1] = useState('');
  const [hex2, setHex2] = useState('');
  const [differences, setDifferences] = useState<HexDifference[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  // Memoized hex normalization function
  const normalizeHex = useCallback((hex: string): string[] => {
    const cleaned = hex.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    const bytes = [];

    for (let i = 0; i < cleaned.length; i += 2) {
      if (i + 1 < cleaned.length) {
        bytes.push(cleaned.substring(i, i + 2));
      } else if (i < cleaned.length) {
        bytes.push(cleaned.substring(i, i + 1) + '0');
      }
    }
    return bytes;
  }, []);

  // Memoized byte counts
  const byte1Count = useMemo(
    () => normalizeHex(hex1).length,
    [hex1, normalizeHex],
  );
  const byte2Count = useMemo(
    () => normalizeHex(hex2).length,
    [hex2, normalizeHex],
  );

  // Memoized comparison function
  const compareHexData = useCallback(() => {
    setIsComparing(true);

    // Use requestIdleCallback for better performance on large datasets
    const performComparison = () => {
      const bytes1 = normalizeHex(hex1);
      const bytes2 = normalizeHex(hex2);
      const maxLength = Math.max(bytes1.length, bytes2.length);
      const diffs: HexDifference[] = [];

      for (let i = 0; i < maxLength; i++) {
        const byte1 = i < bytes1.length ? bytes1[i] : null;
        const byte2 = i < bytes2.length ? bytes2[i] : null;

        let type: HexDifference['type'];
        if (byte1 === null) {
          type = 'added';
        } else if (byte2 === null) {
          type = 'removed';
        } else if (byte1 === byte2) {
          type = 'match';
        } else {
          type = 'different';
        }

        diffs.push({ offset: i, byte1, byte2, type });
      }

      setDifferences(diffs);
      setIsComparing(false);
    };

    // Use setTimeout to prevent UI blocking on large datasets
    setTimeout(performComparison, 0);
  }, [hex1, hex2, normalizeHex]);

  // Memoized clear function
  const clearAll = useCallback(() => {
    setHex1('');
    setHex2('');
    setDifferences([]);
  }, []);

  // Memoized clipboard function
  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  // Memoized statistics calculation
  const stats = useMemo((): Stats => {
    if (differences.length === 0) {
      return { total: 0, matches: 0, different: 0, added: 0, removed: 0 };
    }

    return differences.reduce(
      (acc, diff) => {
        acc.total++;
        const typeMap: Record<HexDifference['type'], keyof Stats> = {
          match: 'matches',
          different: 'different',
          added: 'added',
          removed: 'removed',
        };
        acc[typeMap[diff.type]]++;
        return acc;
      },
      { total: 0, matches: 0, different: 0, added: 0, removed: 0 },
    );
  }, [differences]);

  // Memoized validation
  const canCompare = useMemo(
    () => hex1.trim().length > 0 && hex2.trim().length > 0 && !isComparing,
    [hex1, hex2, isComparing],
  );

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-6xl mx-auto space-y-6'>
        <header className='text-center space-y-2'>
          <h1 className='text-3xl font-bold text-gray-900'>
            HEX Data Comparison Tool
          </h1>
          <p className='text-gray-600'>
            Compare two HEX data sets and visualize the differences
          </p>
        </header>

        <section className='grid md:grid-cols-2 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='w-5 h-5' />
                HEX Data Set 1
              </CardTitle>
              <CardDescription>
                Paste your first HEX data set here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder='Enter HEX data (e.g., 48656C6C6F20576F726C64)'
                value={hex1}
                onChange={e => setHex1(e.target.value)}
                className='min-h-[200px] font-mono text-sm'
                aria-label='First HEX data set'
              />
              <div className='flex justify-between items-center mt-2'>
                <span className='text-sm text-gray-500'>
                  {byte1Count} bytes
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => copyToClipboard(hex1)}
                  disabled={!hex1.trim()}
                  aria-label='Copy first HEX data'
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <FileText className='w-5 h-5' />
                HEX Data Set 2
              </CardTitle>
              <CardDescription>
                Paste your second HEX data set here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder='Enter HEX data (e.g., 48656C6C6F20576F726C64)'
                value={hex2}
                onChange={e => setHex2(e.target.value)}
                className='min-h-[200px] font-mono text-sm'
                aria-label='Second HEX data set'
              />
              <div className='flex justify-between items-center mt-2'>
                <span className='text-sm text-gray-500'>
                  {byte2Count} bytes
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => copyToClipboard(hex2)}
                  disabled={!hex2.trim()}
                  aria-label='Copy second HEX data'
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className='flex justify-center gap-4'>
          <Button onClick={compareHexData} disabled={!canCompare} size='lg'>
            {isComparing ? 'Comparing...' : 'Compare HEX Data'}
          </Button>
          <Button variant='outline' onClick={clearAll} size='lg'>
            <RotateCcw className='w-4 h-4 mr-2' />
            Clear All
          </Button>
        </section>

        {differences.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Comparison Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <StatsBadges stats={stats} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comparison Results</CardTitle>
                <CardDescription>
                  Byte-by-byte comparison with highlighted differences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <div className='flex flex-wrap gap-2 text-xs'>
                    <div className='flex items-center gap-1'>
                      <div className='w-3 h-3 bg-green-100 border border-green-200 rounded' />
                      <span>Match</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='w-3 h-3 bg-red-100 border border-red-200 rounded' />
                      <span>Different</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='w-3 h-3 bg-blue-100 border border-blue-200 rounded' />
                      <span>Added</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='w-3 h-3 bg-gray-100 border border-gray-200 rounded' />
                      <span>Removed</span>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <HexDataDisplay
                      differences={differences}
                      dataSet={1}
                      title='Data Set 1'
                    />
                    <HexDataDisplay
                      differences={differences}
                      dataSet={2}
                      title='Data Set 2'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
