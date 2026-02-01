import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, Button, Input, Textarea, Select } from '@turborepo/ui';
import { OrderStatus } from '@turborepo/dtos';
import { createOrder } from '../../../lib/api';

export const Route = createFileRoute('/_authed/orders/new')({
  component: CreateOrderPage,
});

function CreateOrderPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState<OrderStatus>(OrderStatus.OPEN);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    { value: OrderStatus.OPEN, label: 'Open' },
    { value: OrderStatus.IN_PROGRESS, label: 'In Progress' },
    { value: OrderStatus.PENDING, label: 'Pending' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await createOrder({
        title,
        description,
        assigned_to: assignedTo.trim() || null,
        status,
      });
      navigate({ to: '/orders' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ui-stack ui-stack--gap-lg">
      <div className="ui-flex ui-flex--between ui-flex--center">
        <h2 className="ui-heading ui-heading--2">Create Order</h2>
        <Button variant="ghost" onClick={() => navigate({ to: '/orders' })}>
          Back to Orders
        </Button>
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
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Create Order
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate({ to: '/orders' })}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
