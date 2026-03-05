import { computeSeed, computeColors } from '../index';

describe('Jazzicon', () => {
  it('derives the same colors from equivalent seed and address', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const seed = parseInt(address.slice(2, 10), 16);

    expect(computeColors(computeSeed(address))).toEqual(computeColors(seed));
  });

  it('normalizes address casing when computing seed', () => {
    const addressLower = '0x742d35cc6634c0532925a3b844bc9e7595f2ee31';
    const addressUpper = addressLower.toUpperCase();

    expect(computeSeed(addressLower)).toEqual(computeSeed(addressUpper));
  });

  it('produces different colors for different seeds', () => {
    expect(computeColors(1)).not.toEqual(computeColors(2));
  });
});
