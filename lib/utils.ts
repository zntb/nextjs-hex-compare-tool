import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { HexDifference } from '@/components/HexCompare';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeHex = (hex: string): string[] => {
  const cleaned = hex.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
  const bytes: string[] = [];

  for (let i = 0; i < cleaned.length; i += 2) {
    bytes.push(cleaned.substr(i, 2));
  }

  return bytes;
};

export const compareHexData = (hex1: string, hex2: string): HexDifference[] => {
  const bytes1 = normalizeHex(hex1);
  const bytes2 = normalizeHex(hex2);
  const maxLength = Math.max(bytes1.length, bytes2.length);

  const diffs: HexDifference[] = [];

  for (let i = 0; i < maxLength; i++) {
    const byte1 = i < bytes1.length ? bytes1[i] : null;
    const byte2 = i < bytes2.length ? bytes2[i] : null;

    const type: HexDifference['type'] =
      byte1 === byte2
        ? 'match'
        : byte1 === null
        ? 'added'
        : byte2 === null
        ? 'removed'
        : 'different';

    diffs.push({ offset: i, byte1, byte2, type });
  }

  return diffs;
};

export const getByteStyle = (type: HexDifference['type']) => {
  const map = {
    match: 'bg-green-100 text-green-800 border-green-200',
    different: 'bg-red-100 text-red-800 border-red-200',
    added: 'bg-blue-100 text-blue-800 border-blue-200',
    removed: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return map[type] || 'bg-gray-50 text-gray-600 border-gray-200';
};
