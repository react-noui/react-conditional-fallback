# react-known-error-boundary

## Example usage

```javascript
import KnownErrorBoundary, { AllErrorBoundary, useKnownError, KnownError } from 'react-known-error-boundary`;
import { PageLayout, Nav, Sidebar, BadEntity, Footer, useLoadEntity } from './your/app/code';


class AuthenticationError extends Error {}
class EntityMissing extends Error {}

function App() {
  return (
    <AllErrorBoundary>
      <UnuthenticatedApp />
      <AuthenticatonErrorBoundary fallback={LoginForm}>
        <AuthenticatedApp />
      <AuthenticatonErrorBoundary>
    </AllErrorBoundary>
  )
}

function AuthenticatonErrorBoundary({ fallback, children }) {
  return (
    <KnownErrorBoundary>
      <KnownError guard={e => e instanceof AuthenticationError} fallback={fallback} />
      {children}
    </KnownErrorBoundary>
  );
}

function AuthenticatedApp() {
  return (
    <PageLayout nav={<Nav />} sidebar={<Sidebar />}>
      <KnownErrorBoundary>
        <EntityDetail id="1234" />
      </KnownErrorBoundary>
      <Footer />
    </PageLayout>
  );
}

function EntityDetail({ id }) {
  useKnownError(e => e instanceof EntityMissing, BadEntity);
  const entity = useLoadEntity({ id }); /* throws EntityMissing on 404 */

  return <pre>{JSON.stringify(entity)}</pre>;
}
```
