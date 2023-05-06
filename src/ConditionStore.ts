export type UnsubscribeFunction = () => void;

export default class ConditionStore {
  value: boolean;
  listeners: Array<() => void> = [];

  constructor(initialValue?: boolean) {
    this.value = Boolean(initialValue);
  }

  set() {
    if(this.value !== true) {
      this.value = true;
      this.notify();
    }
  }

  clear() {
    if(this.value !== false) {
      this.value = false;
      this.notify();
    }
  }

  getSnapshot() {
    return this.value;
  }

  subscribe(listener: () => void): UnsubscribeFunction {
    this.listeners = [...this.listeners, listener];

    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }
}