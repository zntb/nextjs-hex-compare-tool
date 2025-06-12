'use client';

import { useState } from 'react';
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

export default function HexCompare() {
  const [hex1, setHex1] = useState('');
  const [hex2, setHex2] = useState('');
  const [differences, setDifferences] = useState<HexDifference[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const normalizeHex = (hex: string): string[] => {
    const cleaned = hex.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    const bytes = [];

    for (let i = 0; i < cleaned.length; i += 2) {
      if (i + 1 < cleaned.length) {
        bytes.push(cleaned.substr(i, 2));
      } else {
        // Instead of padding with '0', treat as incomplete byte
        // and keep the single digit separately to mark it as diff
        bytes.push(cleaned.substr(i, 1));
      }
    }

    return bytes;
  };

  const compareHexData = () => {
    setIsComparing(true);

    const bytes1 = normalizeHex(hex1);
    const bytes2 = normalizeHex(hex2);
    const maxLength = Math.max(bytes1.length, bytes2.length);

    const diffs: HexDifference[] = [];

    for (let i = 0; i < maxLength; i++) {
      const byte1 = i < bytes1.length ? bytes1[i] : null;
      const byte2 = i < bytes2.length ? bytes2[i] : null;

      let type: HexDifference['type'];

      if (byte1 === null && byte2 !== null) {
        type = 'added';
      } else if (byte2 === null && byte1 !== null) {
        type = 'removed';
      } else if (byte1 === byte2) {
        type = 'match';
      } else {
        type = 'different';
      }

      diffs.push({
        offset: i,
        byte1,
        byte2,
        type,
      });
    }

    setDifferences(diffs);
    setIsComparing(false);
  };

  const clearAll = () => {
    setHex1('');
    setHex2('');
    setDifferences([]);
  };

  const getByteStyle = (type: HexDifference['type']) => {
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const stats = {
    total: differences.length,
    matches: differences.filter(d => d.type === 'match').length,
    different: differences.filter(d => d.type === 'different').length,
    added: differences.filter(d => d.type === 'added').length,
    removed: differences.filter(d => d.type === 'removed').length,
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4'>
      <div className='max-w-6xl mx-auto space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold text-gray-900'>
            HEX Data Comparison Tool
          </h1>
          <p className='text-gray-600'>
            Compare two HEX data sets and visualize the differences
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-6'>
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
              />
              <div className='flex justify-between items-center mt-2'>
                <span className='text-sm text-gray-500'>
                  {normalizeHex(hex1).length} bytes
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => copyToClipboard(hex1)}
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
              />
              <div className='flex justify-between items-center mt-2'>
                <span className='text-sm text-gray-500'>
                  {normalizeHex(hex2).length} bytes
                </span>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => copyToClipboard(hex2)}
                >
                  <Copy className='w-4 h-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='flex justify-center gap-4'>
          <Button
            onClick={compareHexData}
            disabled={!hex1.trim() || !hex2.trim() || isComparing}
            size='lg'
          >
            {isComparing ? 'Comparing...' : 'Compare HEX Data'}
          </Button>
          <Button variant='outline' onClick={clearAll} size='lg'>
            <RotateCcw className='w-4 h-4 mr-2' />
            Clear All
          </Button>
        </div>

        {differences.length > 0 && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Comparison Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='flex flex-wrap gap-4'>
                  <Badge variant='outline' className='bg-gray-50'>
                    Total: {stats.total}
                  </Badge>
                  <Badge
                    variant='outline'
                    className='bg-green-50 text-green-700'
                  >
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
                      <div className='w-3 h-3 bg-green-100 border border-green-200 rounded'></div>
                      <span>Match</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='w-3 h-3 bg-red-100 border border-red-200 rounded'></div>
                      <span>Different</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='w-3 h-3 bg-blue-100 border border-blue-200 rounded'></div>
                      <span>Added</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <div className='w-3 h-3 bg-gray-100 border border-gray-200 rounded'></div>
                      <span>Removed</span>
                    </div>
                  </div>

                  <Separator />

                  <div className='space-y-4'>
                    <div>
                      <h4 className='font-medium mb-2'>Data Set 1:</h4>
                      <div className='flex flex-wrap gap-1 p-3 bg-gray-50 rounded-lg font-mono text-sm'>
                        {differences.map((diff, index) => (
                          <span
                            key={`set1-${index}`}
                            className={`px-2 py-1 rounded border text-xs ${getByteStyle(
                              diff.type,
                            )}`}
                            title={`Offset: ${diff.offset}, Type: ${diff.type}`}
                          >
                            {diff.byte1 || '--'}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className='font-medium mb-2'>Data Set 2:</h4>
                      <div className='flex flex-wrap gap-1 p-3 bg-gray-50 rounded-lg font-mono text-sm'>
                        {differences.map((diff, index) => (
                          <span
                            key={`set2-${index}`}
                            className={`px-2 py-1 rounded border text-xs ${getByteStyle(
                              diff.type,
                            )}`}
                            title={`Offset: ${diff.offset}, Type: ${diff.type}`}
                          >
                            {diff.byte2 || '--'}
                          </span>
                        ))}
                      </div>
                    </div>
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
