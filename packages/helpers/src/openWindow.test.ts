import { openWindow } from './openWindow';

describe('openWindow', () => {
  test('should open url', () => {
    const url = 'http://foo.bar';
    const spy = jest.spyOn(window, 'open').mockImplementation(() => null);

    openWindow(url);
    expect(spy).toHaveBeenCalledWith(url, '_blank', 'noopener,noreferrer');

    spy.mockRestore();
  });

  test('should not throw an error on server side', () => {
    const url = 'http://foo.bar';
    const spy = jest
      .spyOn(global, 'window', 'get')
      .mockReturnValue(undefined as any);

    expect(() => openWindow(url)).not.toThrow();

    spy.mockRestore();
  });
});
