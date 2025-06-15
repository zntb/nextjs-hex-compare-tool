import { normalizeHex, compareHexData } from '../lib/utils';

describe('normalizeHex', () => {
  it('should clean and split hex into bytes', () => {
    expect(normalizeHex('48656C6C6F')).toEqual(['48', '65', '6C', '6C', '6F']);
  });

  it('should remove non-hex characters', () => {
    expect(normalizeHex('48 65-6C:6C6F')).toEqual([
      '48',
      '65',
      '6C',
      '6C',
      '6F',
    ]);
  });

  it('should handle odd-length hex string', () => {
    expect(normalizeHex('ABC')).toEqual(['AB', 'C']);
  });
});

describe('compareHexData', () => {
  it('should correctly compare matching strings', () => {
    const result = compareHexData('AABBCC', 'AABBCC');
    expect(result.every(r => r.type === 'match')).toBe(true);
  });

  it('should detect differences', () => {
    const result = compareHexData('AABBCC', 'AABBDD');
    expect(result).toEqual([
      { offset: 0, byte1: 'AA', byte2: 'AA', type: 'match' },
      { offset: 1, byte1: 'BB', byte2: 'BB', type: 'match' },
      { offset: 2, byte1: 'CC', byte2: 'DD', type: 'different' },
    ]);
  });

  it('should detect added bytes', () => {
    const result = compareHexData('AABB', 'AABBCC');
    expect(result[2]).toEqual({
      offset: 2,
      byte1: null,
      byte2: 'CC',
      type: 'added',
    });
  });

  it('should detect removed bytes', () => {
    const result = compareHexData('AABBCC', 'AABB');
    expect(result[2]).toEqual({
      offset: 2,
      byte1: 'CC',
      byte2: null,
      type: 'removed',
    });
  });
});
