import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Select } from '@turborepo/ui';
import { OrderStatus } from '@turborepo/dtos';
import type { IOrder } from '@turborepo/dtos';
import { getOrder, updateOrder, deleteOrder } from '../../../lib/api';

export const Route = createFileRoute('/_authed/orders/$id')({
  component: EditOrderPage,
});

function EditOrderPage() {
  const navigate = useNavigate();
  const { id } = Route.useParams();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.OPEN);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

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
        setTitle(data.title);
        setDescription(data.description);
        setAssignedTo(data.assigned_to || '');
        setStatus(data.status);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await updateOrder(id, {
        title,
        description,
        assigned_to: assignedTo.trim() || null,
        status,
      });
      navigate({ to: '/orders' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      await deleteOrder(id);
      navigate({ to: '/orders' });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete order');
    }
  };

  if (isLoading) {
    return <p className="ui-text">Loading...</p>;
  }

  if (error && !order) {
    return <p className="ui-text" style={{ color: 'var(--ui-color-error)' }}>{error}</p>;
  }

  return (
    <div className="ui-stack ui-stack--gap-lg">
      <div className="ui-flex ui-flex--between ui-flex--center">
        <h2 className="ui-heading ui-heading--2">Edit Order</h2>
        <div className="ui-flex ui-flex--gap-sm">
          <Button variant="ghost" onClick={() => navigate({ to: '/orders' })}>
            Back to Orders
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      <Card variant="default">
        <form onSubmit={handleSubmit} className="ui-stack ui-stack--gap-md">
          {error && (
            <p className="ui-text" style={{ color: 'var(--ui-color-error)' }}>{error}</p>
          )}

          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Order title"
            required
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Order description"
            required
          />

          <Input
            label="Assigned To (Email)"
            type="email"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder="user@example.com (leave empty for unassigned)"
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            options={statusOptions}
          />

          <div className="ui-flex ui-flex--gap-sm">
            <Button type="submit" variant="primary" isLoading={isSaving}>
              Save Changes
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: '/orders' })}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {order && (
        <Card title="Order Details" variant="outlined">
          <div className="ui-stack ui-stack--gap-sm">
            <p className="ui-text ui-text--sm">
              <strong>ID:</strong> {order.id}
            </p>
            <p className="ui-text ui-text--sm">
              <strong>Created:</strong> {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
