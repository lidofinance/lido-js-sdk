import { LedgerHQFrameConnector } from './ledgerHQFrame';

class FakeParentWindow {
  fakeWindow = new FakeWindow();

  received: { payload: any; targetOrigin: string }[] = [];

  postMessage(payload: any, targetOrigin: string) {
    this.received.push({ payload, targetOrigin });
  }
}

class FakeWindow {
  private listeners: any[] = [];

  addEventListener(
    eventType: 'message',
    listener: (event: MessageEvent) => void,
  ) {
    if (eventType !== 'message') {
      throw new Error('event type must be message');
    }

    this.listeners.push(listener);
  }

  sendMessage(message: any) {
    this.listeners.forEach((listener) => listener({ data: message }));
  }
}

let parent: FakeParentWindow;
let child: FakeWindow;

beforeEach(() => {
  parent = new FakeParentWindow();
  child = parent.fakeWindow;
});

let Connector: LedgerHQFrameConnector;
let mockEmit: jest.SpyInstance<any, unknown[]>;
const account = '0x0';

beforeEach(async () => {
  parent.received = [];

  Connector = new LedgerHQFrameConnector({
    eventTarget: parent,
    eventSource: child,
  });

  const promise = Connector.activate();

  await import('@ledgerhq/iframe-provider');

  const message = parent.received[0];

  child.sendMessage({
    jsonrpc: '2.0',
    result: [account],
    id: message.payload.id,
  });

  mockEmit = jest
    .spyOn(Connector as any, 'emitUpdate')
    .mockImplementation(() => void 0);

  await promise;
});

describe('LedgerHQFrameConnector', () => {
  test('should activate correctly', async () => {
    const result = await Connector.activate();

    expect(result.account).toBe(account);
    expect(result.provider).toBeInstanceOf(Object);
  });

  test('should contain check method', async () => {
    expect(Connector.isLedgerApp).toBeInstanceOf(Function);
    expect(Connector.isLedgerApp()).toBe(false);
  });

  test('should return provider', async () => {
    expect(Connector.getProvider).toBeInstanceOf(Function);
    expect(Connector.getProvider()).toBeInstanceOf(Object);
  });

  test('should return chainId', async () => {
    expect(Connector.getChainId).toBeInstanceOf(Function);

    const expected = 1;

    const promise = Connector.getChainId();
    const message = parent.received[1];

    child.sendMessage({
      jsonrpc: '2.0',
      result: expected,
      id: message.payload.id,
    });

    await expect(promise).resolves.toBe(expected);
  });

  test('should return account', async () => {
    expect(Connector.getAccount).toBeInstanceOf(Function);

    const expected = [account];

    const promise = Connector.getAccount();
    const message = parent.received[1];

    child.sendMessage({
      jsonrpc: '2.0',
      result: expected,
      id: message.payload.id,
    });

    await expect(promise).resolves.toBe(account);
  });

  test('should deactivate correctly', async () => {
    expect(Connector.deactivate).toBeInstanceOf(Function);
    expect(() => Connector.deactivate()).not.toThrowError();
  });

  test('should have network listener', async () => {
    const expected = 1;

    await child.sendMessage({
      jsonrpc: '2.0',
      method: 'networkChanged',
      params: [expected],
    });

    expect(mockEmit).toBeCalledTimes(1);
    expect(mockEmit).toBeCalledWith(
      expect.objectContaining({ chainId: expected }),
    );
  });

  test('should have chain listener', async () => {
    const expected = 1;

    await child.sendMessage({
      jsonrpc: '2.0',
      method: 'chainChanged',
      params: [expected],
    });

    expect(mockEmit).toBeCalledTimes(1);
    expect(mockEmit).toBeCalledWith(
      expect.objectContaining({ chainId: expected }),
    );
  });

  test('should have accounts listener', async () => {
    const expected = account;

    await child.sendMessage({
      jsonrpc: '2.0',
      method: 'accountsChanged',
      params: [[expected]],
    });

    expect(mockEmit).toBeCalledTimes(1);
    expect(mockEmit).toBeCalledWith(
      expect.objectContaining({ account: expected }),
    );

    await child.sendMessage({
      jsonrpc: '2.0',
      method: 'accountsChanged',
      params: [[]],
    });

    expect(mockEmit).toBeCalledWith(expect.objectContaining({ account: null }));
  });

  test('should have close listener', async () => {
    const mockEmit = jest
      .spyOn(Connector as any, 'emitDeactivate')
      .mockImplementation(() => void 0);

    await child.sendMessage({
      jsonrpc: '2.0',
      method: 'close',
      params: [],
    });

    expect(mockEmit).toBeCalledTimes(1);
  });
});
