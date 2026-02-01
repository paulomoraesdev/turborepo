import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Table, Button, StatusBadge } from '@turborepo/ui';
import type { TableColumn } from '@turborepo/ui';
import type { IOrder } from '@turborepo/dtos';
import { getOrders, deleteOrder } from '../../../lib/api';

export const Route = createFileRoute('/_authed/orders/')({
  component: OrdersListPage,
});

function OrdersListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await deleteOrder(id);
      await fetchOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

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
      header: 'Assigned To',
      render: (order) => order.assigned_to || <span className="ui-text ui-text--muted">Unassigned</span>,
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (order) => new Date(order.created_at).toLocaleDateString(),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (order) => (
        <div className="ui-flex ui-flex--gap-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate({ to: '/orders/$id', params: { id: order.id } });
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(order.id);
            }}
          >
            Delete
          </Button>
        </div>
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
        <Button variant="primary" onClick={() => navigate({ to: '/orders/new' })}>
          Create Order
        </Button>
      </div>

      <Table
        columns={columns}
        data={orders}
        keyExtractor={(order) => order.id}
        emptyMessage="No orders found"
        onRowClick={(order) => navigate({ to: '/orders/$id', params: { id: order.id } })}
      />
    </div>
  );
}
