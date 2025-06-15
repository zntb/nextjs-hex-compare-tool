'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import HexInputCard from './HexInputCard';
import ComparisonStats from './ComparisonStats';
import ComparisonResults from './ComparisonResults';
import { compareHexData } from '@/lib/utils';

export interface HexDifference {
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

  const handleCompare = () => {
    setIsComparing(true);
    setDifferences(compareHexData(hex1, hex2));
    setIsComparing(false);
  };

  const clearAll = () => {
    setHex1('');
    setHex2('');
    setDifferences([]);
  };

  return (
    <div className='min-h-screen bg-gray-50 p-4' data-testid='hex-compare-root'>
      <div className='max-w-6xl mx-auto space-y-6'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold text-gray-900' data-testid='title'>
            HEX Data Comparison Tool
          </h1>
          <p className='text-gray-600' data-testid='description'>
            Compare two HEX data sets and visualize the differences
          </p>
        </div>

        <div className='grid md:grid-cols-2 gap-6' data-testid='input-section'>
          <HexInputCard
            title='HEX Data Set 1'
            data-testid='hex-input-1'
            value={hex1}
            onChange={setHex1}
          />
          <HexInputCard
            title='HEX Data Set 2'
            data-testid='hex-input-2'
            value={hex2}
            onChange={setHex2}
          />
        </div>

        <div className='flex justify-center gap-4' data-testid='action-buttons'>
          <Button
            onClick={handleCompare}
            disabled={!hex1 || !hex2 || isComparing}
            size='lg'
            data-testid='compare-button'
          >
            {isComparing ? 'Comparing...' : 'Compare HEX Data'}
          </Button>
          <Button
            variant='outline'
            onClick={clearAll}
            size='lg'
            data-testid='clear-button'
          >
            <RotateCcw className='w-4 h-4 mr-2' />
            Clear All
          </Button>
        </div>

        {differences.length > 0 && (
          <div data-testid='results-section'>
            <ComparisonStats differences={differences} />
            <ComparisonResults differences={differences} />
          </div>
        )}
      </div>
    </div>
  );
}
