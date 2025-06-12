import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HexDifference } from './HexCompare';

export default function ComparisonStats({
  differences,
}: {
  differences: HexDifference[];
}) {
  const stats = {
    total: differences.length,
    matches: differences.filter(d => d.type === 'match').length,
    different: differences.filter(d => d.type === 'different').length,
    added: differences.filter(d => d.type === 'added').length,
    removed: differences.filter(d => d.type === 'removed').length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparison Statistics</CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}
