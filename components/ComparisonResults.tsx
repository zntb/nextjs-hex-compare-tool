import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HexDifference } from './HexCompare';
import { getByteStyle } from '@/lib/utils';
import Legend from './Legend';

export default function ComparisonResults({
  differences,
}: {
  differences: HexDifference[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Results</CardTitle>
        <CardDescription>
          Byte-by-byte comparison with highlighted differences
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <Legend />
        <Separator />
        <div className='space-y-4'>
          {['Data Set 1', 'Data Set 2'].map((label, i) => (
            <div key={label}>
              <h4 className='font-medium mb-2'>{label}:</h4>
              <div className='flex flex-wrap gap-1 p-3 bg-gray-50 rounded-lg font-mono text-sm'>
                {differences.map((diff, index) => {
                  const byte = i === 0 ? diff.byte1 : diff.byte2;
                  return (
                    <span
                      key={`${label}-${index}`}
                      className={`px-2 py-1 rounded border text-xs ${getByteStyle(
                        diff.type,
                      )}`}
                      title={`Offset: ${diff.offset}, Type: ${diff.type}`}
                    >
                      {byte || '--'}
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
