import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, FileText } from 'lucide-react';
import { normalizeHex } from '@/lib/utils';

interface HexInputCardProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  'data-testid'?: string;
}

export default function HexInputCard({
  title,
  value,
  onChange,
  'data-testid': dataTestId,
  ...props
}: HexInputCardProps) {
  const handleCopy = () => navigator.clipboard.writeText(value);

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <FileText className='w-5 h-5' />
          {title}
        </CardTitle>
        <CardDescription>Paste your HEX data here</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          data-testid={dataTestId}
          value={value}
          onChange={e => onChange(e.target.value)}
          className='min-h-[200px] font-mono text-sm'
          placeholder='Enter HEX data (e.g., 48656C6C6F20576F726C64)'
        />
        <div className='flex justify-between items-center mt-2'>
          <span className='text-sm text-gray-500'>
            {normalizeHex(value).length} bytes
          </span>
          <Button variant='outline' size='sm' onClick={handleCopy}>
            <Copy className='w-4 h-4' />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
