import ConditionStore from './ConditionStore';
import React, { PropsWithChildren, ReactNode, createContext, useContext, useMemo, useSyncExternalStore } from 'react';

export type ConditionalFallbackProps = PropsWithChildren<{fallback: ReactNode}>;

export type ConditionalFallbackContext = {
  value: boolean,
  set: () => void,
  clear: () => void,
};

export default function createConditionalFallback(initialValue?: boolean) {
  const store = new ConditionStore(initialValue);

  const set = store.set.bind(store);
  const clear = store.clear.bind(store);
  const subscribe = store.subscribe.bind(store);
  const getSnapshot = store.getSnapshot.bind(store);

  const Context = createContext<ConditionalFallbackContext | null>(null);

  function Provider({children}: PropsWithChildren) {
    const value = useSyncExternalStore(subscribe, getSnapshot);
    const context = useMemo(() => ({ value, set, clear }), [value]);
    return <Context.Provider value={context}>{children}</Context.Provider>;
  }

  function ConditionalFallback({ fallback, children }: ConditionalFallbackProps) {
    const context = useContext(Context);

    if( context === null) {
      return <Provider><ConditionalFallback fallback={fallback}>{children}</ConditionalFallback></Provider>;
    }

    return <>{context.value ? fallback : children}</>
  }

  function useCondition() {
    const { value } = useContext(Context) || { value: initialValue };
    return Boolean(value);
  }

  return {
    set,
    clear,
    Provider,
    ConditionalFallback,
    useCondition,
  };
}
