jest.mock('node-fetch');

import fetch from 'node-fetch';
import { fetchWithFallbacks } from './fetchWithFallbacks';

const { Response } = jest.requireActual('node-fetch');
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('fetchWithFallbacks', () => {
  const params = { method: 'POST' };
  const urlFirst = 'https://first.com';
  const urlSecond = 'https://second.com';
  const expected = 42;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  test('should throw if inputs are not passed', async () => {
    await expect(fetchWithFallbacks([])).rejects.toThrowError();
  });

  test('should fetch correctly', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(expected)));

    const response = await fetchWithFallbacks([urlFirst], params);
    const result = await response.json();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(urlFirst, params);
    expect(result).toBe(expected);
  });

  test('should be rejected if both urls reject', async () => {
    mockFetch.mockReturnValue(Promise.reject(new Error()));

    await expect(
      fetchWithFallbacks([urlFirst, urlSecond], params),
    ).rejects.toThrowError();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(1, urlFirst, params);
    expect(fetch).toHaveBeenNthCalledWith(2, urlSecond, params);
  });

  test('should use second url', async () => {
    mockFetch.mockReturnValue(Promise.resolve(new Response(expected)));
    mockFetch.mockReturnValueOnce(Promise.reject(new Error()));

    const response = await fetchWithFallbacks([urlFirst, urlSecond], params);
    const result = await response.json();

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch).toHaveBeenNthCalledWith(1, urlFirst, params);
    expect(fetch).toHaveBeenNthCalledWith(2, urlSecond, params);
    expect(result).toBe(expected);
  });
});
