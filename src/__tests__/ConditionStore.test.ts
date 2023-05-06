import ConditionStore from "ConditionStore";

describe('#ConditionStore', () => {
  it('stores initial values', () => {
    const store1 = new ConditionStore(false);
    expect(store1.getSnapshot()).toBe(false);

    const store2 = new ConditionStore(true);
    expect(store2.getSnapshot()).toBe(true);
  });

  it('updates value on `set`', () => {
    const store = new ConditionStore(false);
    store.set();
    expect(store.getSnapshot()).toBe(true);
  });

  it('updates value on `clear`', () => {
    const store = new ConditionStore(true);
    store.clear();
    expect(store.getSnapshot()).toBe(false);
  });

  it('notifies listeners on `set` or `clear`', () => {
    const listener = jest.fn();

    const store = new ConditionStore(false);
    store.subscribe(listener);
    expect(listener.mock.calls.length).toBe(0);

    store.set();
    expect(listener.mock.calls.length).toBe(1);

    store.clear();
    expect(listener.mock.calls.length).toBe(2);
  });

  it('does not notify listeners that have been unsubscribed', () => {
    const listener1 = jest.fn();
    const listener2 = jest.fn();

    const store = new ConditionStore(false);
    const unsubscribeListener1 = store.subscribe(listener1);
    const unsubscribeListener2 = store.subscribe(listener2);
    expect(listener1.mock.calls.length).toBe(0);
    expect(listener2.mock.calls.length).toBe(0);

    store.set();
    expect(listener1.mock.calls.length).toBe(1);
    expect(listener2.mock.calls.length).toBe(1);

    unsubscribeListener2();

    store.clear();
    expect(listener1.mock.calls.length).toBe(2);
    expect(listener2.mock.calls.length).toBe(1);

    unsubscribeListener1();

    store.set();
    expect(listener1.mock.calls.length).toBe(2);
    expect(listener2.mock.calls.length).toBe(1);
  });

  it('notifies listeners on `set` or `clear` only if value changes', () => {
    const listener = jest.fn();

    const store = new ConditionStore(false);
    store.subscribe(listener);
    expect(listener.mock.calls.length).toBe(0);

    store.set();
    expect(listener.mock.calls.length).toBe(1);
    store.set();
    expect(listener.mock.calls.length).toBe(1);

    store.clear();
    expect(listener.mock.calls.length).toBe(2);
    store.clear();
    expect(listener.mock.calls.length).toBe(2);
  });
});
