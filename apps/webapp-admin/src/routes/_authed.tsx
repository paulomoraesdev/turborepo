import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router';
import { isAuthenticated, getCurrentUser, clearToken, isAdmin } from '@turborepo/auth';
import { Button } from '@turborepo/ui';

export const Route = createFileRoute('/_authed')({
  beforeLoad: () => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!isAuthenticated()) {
      throw redirect({ to: '/' });
    }

    const user = getCurrentUser();
    if (!user || !isAdmin(user)) {
      clearToken();
      throw redirect({ to: '/' });
    }
  },
  component: AuthedLayout,
});

function AuthedLayout() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleLogout = () => {
    clearToken();
    navigate({ to: '/' });
  };

  return (
    <div className="ui-page">
      <header className="ui-page__header">
        <div className="ui-container">
          <div className="ui-flex ui-flex--between ui-flex--center">
            <div className="ui-flex ui-flex--center ui-flex--gap-md">
              <h1 className="ui-heading ui-heading--2">Admin Panel</h1>
              <nav className="ui-flex ui-flex--gap-sm">
                <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/dashboard' })}>
                  Dashboard
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/orders' })}>
                  Orders
                </Button>
              </nav>
            </div>
            <div className="ui-flex ui-flex--center ui-flex--gap-md">
              <span className="ui-text ui-text--secondary ui-text--sm">
                {user?.email}
              </span>
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="ui-page__content">
        <div className="ui-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
