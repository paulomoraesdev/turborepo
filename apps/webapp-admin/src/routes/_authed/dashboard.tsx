import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, Button } from '@turborepo/ui';
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

  const stats = {
    total: orders.length,
    open: orders.filter((o) => o.status === 'OPEN').length,
    inProgress: orders.filter((o) => o.status === 'IN_PROGRESS').length,
    pending: orders.filter((o) => o.status === 'PENDING').length,
    assigned: orders.filter((o) => o.assigned_to !== null).length,
    unassigned: orders.filter((o) => o.assigned_to === null).length,
  };

  if (isLoading) {
    return <p className="ui-text">Loading...</p>;
  }

  if (error) {
    return <p className="ui-text" style={{ color: 'var(--ui-color-error)' }}>{error}</p>;
  }

  return (
    <div className="ui-stack ui-stack--gap-lg">
      <div className="ui-flex ui-flex--between ui-flex--center">
        <h2 className="ui-heading ui-heading--2">Dashboard</h2>
        <Button variant="primary" onClick={() => navigate({ to: '/orders/new' })}>
          Create Order
        </Button>
      </div>

      <div className="dashboard-stats">
        <Card variant="outlined">
          <div className="stat-item">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </Card>
        <Card variant="outlined">
          <div className="stat-item">
            <span className="stat-value stat-value--info">{stats.open}</span>
            <span className="stat-label">Open</span>
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
            <span className="stat-value stat-value--success">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </Card>
        <Card variant="outlined">
          <div className="stat-item">
            <span className="stat-value">{stats.assigned}</span>
            <span className="stat-label">Assigned</span>
          </div>
        </Card>
        <Card variant="outlined">
          <div className="stat-item">
            <span className="stat-value stat-value--muted">{stats.unassigned}</span>
            <span className="stat-label">Unassigned</span>
          </div>
        </Card>
      </div>

      <Card title="Recent Orders" variant="default">
        {orders.slice(0, 5).map((order) => (
          <div key={order.id} className="recent-order-item" onClick={() => navigate({ to: '/orders/$id', params: { id: order.id } })}>
            <span className="ui-text">{order.title}</span>
            <span className="ui-text ui-text--secondary ui-text--sm">{order.status}</span>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="ui-text ui-text--muted">No orders yet</p>
        )}
      </Card>
    </div>
  );
}
