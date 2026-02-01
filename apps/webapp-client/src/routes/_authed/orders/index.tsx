import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Table, Button, StatusBadge, Badge } from '@turborepo/ui';
import type { TableColumn } from '@turborepo/ui';
import { getCurrentUser } from '@turborepo/auth';
import type { IOrder } from '@turborepo/dtos';
import { getOrders } from '../../../lib/api';

export const Route = createFileRoute('/_authed/orders/')({
  component: OrdersListPage,
});

function OrdersListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'mine' | 'available'>('all');
  const user = getCurrentUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
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

  const filteredOrders = orders.filter((order) => {
    if (filter === 'mine') {
      return order.assigned_to === user?.email;
    }
    if (filter === 'available') {
      return order.assigned_to === null;
    }
    return true;
  });

  const columns: TableColumn<IOrder>[] = [
    {
      key: 'title',
      header: 'Title',
    },
    {
      key: 'status',
      header: 'Status',
      render: (order) => <StatusBadge status={order.status} />,
    },
    {
      key: 'assigned_to',
      header: 'Assignment',
      render: (order) => {
        if (order.assigned_to === user?.email) {
          return <Badge variant="success">Assigned to me</Badge>;
        }
        if (order.assigned_to === null) {
          return <Badge variant="info">Available</Badge>;
        }
        return <span className="ui-text ui-text--muted">Other user</span>;
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (order) => new Date(order.created_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: '',
      render: (order) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate({ to: '/orders/$id', params: { id: order.id } });
          }}
        >
          View
        </Button>
      ),
    },
  ];

  if (isLoading) {
    return <p className="ui-text">Loading...</p>;
  }

  if (error) {
    return <p className="ui-text" style={{ color: 'var(--ui-color-error)' }}>{error}</p>;
  }

  return (
    <div className="ui-stack ui-stack--gap-lg">
      <div className="ui-flex ui-flex--between ui-flex--center">
        <h2 className="ui-heading ui-heading--2">Orders</h2>
        <div className="ui-flex ui-flex--gap-sm">
          <Button
            variant={filter === 'all' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({orders.length})
          </Button>
          <Button
            variant={filter === 'mine' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('mine')}
          >
            Mine ({orders.filter((o) => o.assigned_to === user?.email).length})
          </Button>
          <Button
            variant={filter === 'available' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setFilter('available')}
          >
            Available ({orders.filter((o) => o.assigned_to === null).length})
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={filteredOrders}
        keyExtractor={(order) => order.id}
        emptyMessage="No orders found"
        onRowClick={(order) => navigate({ to: '/orders/$id', params: { id: order.id } })}
      />
    </div>
  );
}
