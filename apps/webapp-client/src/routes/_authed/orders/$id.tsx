import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, Button, Select, StatusBadge, Badge } from '@turborepo/ui';
import { OrderStatus } from '@turborepo/dtos';
import type { IOrder } from '@turborepo/dtos';
import { getCurrentUser } from '@turborepo/auth';
import { getOrder, updateOrder } from '../../../lib/api';

export const Route = createFileRoute('/_authed/orders/$id')({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.OPEN);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  const statusOptions = [
    { value: OrderStatus.OPEN, label: 'Open' },
    { value: OrderStatus.IN_PROGRESS, label: 'In Progress' },
    { value: OrderStatus.PENDING, label: 'Pending' },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrder(id);
        setOrder(data);
        setStatus(data.status);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const isAssignedToMe = order?.assigned_to === user?.email;
  const isAvailable = order?.assigned_to === null;
  const canModify = isAssignedToMe || isAvailable;

  const handleAssignToMe = async () => {
    if (!user) return;
    setIsSaving(true);

    try {
      const updated = await updateOrder(id, {
        assigned_to: user.email,
      });
      setOrder(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to assign order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsSaving(true);

    try {
      const updated = await updateOrder(id, {
        status: newStatus,
      });
      setOrder(updated);
      setStatus(updated.status);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="ui-text">Loading...</p>;
  }

  if (error) {
    return <p className="ui-text" style={{ color: 'var(--ui-color-error)' }}>{error}</p>;
  }

  if (!order) {
    return <p className="ui-text">Order not found</p>;
  }

  return (
    <div className="ui-stack ui-stack--gap-lg">
      <div className="ui-flex ui-flex--between ui-flex--center">
        <h2 className="ui-heading ui-heading--2">Order Details</h2>
        <Button variant="ghost" onClick={() => navigate({ to: '/orders' })}>
          Back to Orders
        </Button>
      </div>

      <Card variant="elevated">
        <div className="ui-stack ui-stack--gap-md">
          <div className="ui-flex ui-flex--between ui-flex--center">
            <h3 className="ui-heading ui-heading--3">{order.title}</h3>
            <StatusBadge status={order.status} size="lg" />
          </div>

          <p className="ui-text">{order.description}</p>

          <div className="order-meta">
            <div className="order-meta-item">
              <span className="ui-text ui-text--secondary ui-text--sm">Assignment:</span>
              {isAssignedToMe ? (
                <Badge variant="success">Assigned to me</Badge>
              ) : isAvailable ? (
                <Badge variant="info">Available</Badge>
              ) : (
                <span className="ui-text">{order.assigned_to}</span>
              )}
            </div>
            <div className="order-meta-item">
              <span className="ui-text ui-text--secondary ui-text--sm">Created:</span>
              <span className="ui-text">{new Date(order.created_at).toLocaleString()}</span>
            </div>
            <div className="order-meta-item">
              <span className="ui-text ui-text--secondary ui-text--sm">Order ID:</span>
              <span className="ui-text ui-text--sm" style={{ fontFamily: 'var(--ui-font-mono)' }}>
                {order.id}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {canModify && (
        <Card title="Actions" variant="default">
          <div className="ui-stack ui-stack--gap-md">
            {isAvailable && (
              <div className="ui-flex ui-flex--gap-md ui-flex--center">
                <span className="ui-text">This order is available for assignment.</span>
                <Button
                  variant="primary"
                  onClick={handleAssignToMe}
                  isLoading={isSaving}
                >
                  Assign to Me
                </Button>
              </div>
            )}

            {isAssignedToMe && (
              <div className="ui-stack ui-stack--gap-sm">
                <span className="ui-text ui-text--secondary">Update Status:</span>
                <div className="ui-flex ui-flex--gap-md ui-flex--center">
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    options={statusOptions}
                    className="status-select"
                  />
                  <Button
                    variant="primary"
                    onClick={() => handleStatusChange(status)}
                    isLoading={isSaving}
                    disabled={status === order.status}
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {!canModify && (
        <Card variant="outlined">
          <p className="ui-text ui-text--muted">
            This order is assigned to another user. You can only view it.
          </p>
        </Card>
      )}
    </div>
  );
}
