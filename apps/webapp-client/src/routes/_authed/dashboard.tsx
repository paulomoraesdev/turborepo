import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, Button, StatusBadge } from '@turborepo/ui';
import { getCurrentUser } from '@turborepo/auth';
import type { IOrder } from '@turborepo/dtos';
import { getOrders } from '../../lib/api';

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const myOrders = orders.filter((o) => o.assigned_to === user?.email);
  const availableOrders = orders.filter((o) => o.assigned_to === null);

  const stats = {
    total: orders.length,
    assigned: myOrders.length,
    available: availableOrders.length,
    inProgress: myOrders.filter((o) => o.status === 'IN_PROGRESS').length,
  };

  if (isLoading) {
    return <p className="ui-text">Loading...</p>;
  }

  if (error) {
    return <p className="ui-text" style={{ color: 'var(--ui-color-error)' }}>{error}</p>;
  }

  return (
    <div className="ui-stack ui-stack--gap-lg">
      <h2 className="ui-heading ui-heading--2">Welcome, {user?.email}</h2>

      <div className="dashboard-stats">
        <Card variant="outlined">
          <div className="stat-item">
            <span className="stat-value">{stats.assigned}</span>
            <span className="stat-label">My Orders</span>
          </div>
        </Card>
        <Card variant="outlined">
          <div className="stat-item">
            <span className="stat-value stat-value--warning">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </Card>
        <Card variant="outlined">
          <div className="stat-item">
            <span className="stat-value stat-value--info">{stats.available}</span>
            <span className="stat-label">Available</span>
          </div>
        </Card>
      </div>

      <Card title="My Assigned Orders" variant="default">
        {myOrders.length > 0 ? (
          myOrders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="recent-order-item"
              onClick={() => navigate({ to: '/orders/$id', params: { id: order.id } })}
            >
              <span className="ui-text">{order.title}</span>
              <StatusBadge status={order.status} />
            </div>
          ))
        ) : (
          <p className="ui-text ui-text--muted">No orders assigned to you yet</p>
        )}
        {myOrders.length > 5 && (
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/orders' })}>
            View all orders
          </Button>
        )}
      </Card>

      <Card title="Available Orders" subtitle="Orders you can assign to yourself" variant="default">
        {availableOrders.length > 0 ? (
          availableOrders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="recent-order-item"
              onClick={() => navigate({ to: '/orders/$id', params: { id: order.id } })}
            >
              <span className="ui-text">{order.title}</span>
              <StatusBadge status={order.status} />
            </div>
          ))
        ) : (
          <p className="ui-text ui-text--muted">No available orders at the moment</p>
        )}
      </Card>
    </div>
  );
}
