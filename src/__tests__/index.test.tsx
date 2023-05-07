import { act, render, waitForElementToBeRemoved } from '@testing-library/react';

import createConditionalFallback from "index";

function MainComponent() {
  return <div data-testid="main">Condition is FALSE.</div>;
}

function FallbackComponent() {
  return <div data-testid="fallback">Condition is TRUE.</div>;
}

describe('#react-conditional-fallback', () => {
  it('renders the happy path', async () => {
    const { ConditionalFallback } = createConditionalFallback(false);

    const { queryByTestId } = render(
      <ConditionalFallback fallback={<FallbackComponent />}>
        <MainComponent />
      </ConditionalFallback>,
    );

    expect(await queryByTestId('main')).not.toEqual(null);
    expect(await queryByTestId('fallback')).toEqual(null);
  });

  it('renders the fallback path', async () => {
    const { ConditionalFallback } = createConditionalFallback(true);

    const { queryByTestId } = render(
      <ConditionalFallback fallback={<FallbackComponent />}>
        <MainComponent />
      </ConditionalFallback>,
    );

    expect(await queryByTestId('main')).toEqual(null);
    expect(await queryByTestId('fallback')).not.toEqual(null);
  });

  it('updates on state change', async () => {
    const { ConditionalFallback, set } = createConditionalFallback(false);

    const { queryByTestId } = render(
      <ConditionalFallback fallback={<FallbackComponent />}>
        <MainComponent />
      </ConditionalFallback>,
    );

    expect(await queryByTestId('main')).not.toEqual(null);
    expect(await queryByTestId('fallback')).toEqual(null);

    act(() => {
      set();
    });

    expect(await queryByTestId('main')).toEqual(null);
    expect(await queryByTestId('fallback')).not.toEqual(null);
  });

  it('works with the provider as an ancestor', async () => {
    const { Provider, ConditionalFallback, set } = createConditionalFallback(false);

    const { queryByTestId } = render(
      <Provider>
        <ConditionalFallback fallback={<FallbackComponent />}>
          <MainComponent />
        </ConditionalFallback>
      </Provider>,
    );

    expect(await queryByTestId('main')).not.toEqual(null);
    expect(await queryByTestId('fallback')).toEqual(null);

    act(() => {
      set();
    });

    expect(await queryByTestId('main')).toEqual(null);
    expect(await queryByTestId('fallback')).not.toEqual(null);
  });

  it('provides the correct value to the hook', async () => {
    const { Provider, useCondition, set } = createConditionalFallback(false);

    function ConditionValue() {
      const value = useCondition();
      return <pre>{value.toString().toUpperCase()}</pre>;
    }

    const { queryByText } = render(<Provider><ConditionValue /></Provider>);

    expect(await queryByText('TRUE')).toEqual(null);
    expect(await queryByText('FALSE')).not.toEqual(null);

    act(() => {
      set();
    });

    expect(await queryByText('TRUE')).not.toEqual(null);
    expect(await queryByText('FALSE')).toEqual(null);
  });
});
