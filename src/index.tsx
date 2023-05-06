import { PropsWithChildren } from 'react';

export default function createConditionalFallback({
  children,
}: PropsWithChildren) {
  return <>{children}</>
}
