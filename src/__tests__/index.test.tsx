import { Jazzicon } from '../index';

describe('Jazzicon', () => {
  it('derives the same state from equivalent seed and address', () => {
    const address = '0x1234567890123456789012345678901234567890';
    const seedFromAddress = parseInt(address.slice(2, 10), 16);

    const stateFromAddress = (Jazzicon as any).propsToState({ address });
    const stateFromSeed = (Jazzicon as any).propsToState({
      seed: seedFromAddress,
    });

    expect(stateFromAddress.colors).toEqual(stateFromSeed.colors);
  });

  it('normalizes address casing when deriving state', () => {
    const addressLower = '0x742d35cc6634c0532925a3b844bc9e7595f2ee31';
    const addressUpper = addressLower.toUpperCase();

    const stateFromLower = (Jazzicon as any).propsToState({
      address: addressLower,
    });
    const stateFromUpper = (Jazzicon as any).propsToState({
      address: addressUpper,
    });

    expect(stateFromUpper.colors).toEqual(stateFromLower.colors);
  });

  it('getDerivedStateFromProps delegates to propsToState', () => {
    const props = { address: '0x8Ba1f109551bD432803012645Ac136ddd64DBA72' };
    const spy = jest.spyOn(Jazzicon as any, 'propsToState');

    (Jazzicon as any).getDerivedStateFromProps(props, {} as any);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(props);

    spy.mockRestore();
  });
});
