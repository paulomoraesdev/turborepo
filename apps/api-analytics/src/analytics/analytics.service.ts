import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@turborepo/dtos';
import type { IAnalyticsSummary, IOrder } from '@turborepo/dtos';

@Injectable()
export class AnalyticsService {
  private mockOrders: IOrder[] = [
    {
      id: '1',
      created_at: new Date().toISOString(),
      status: OrderStatus.OPEN,
      assigned_to: null,
      title: 'Order 1',
      description: 'Description 1',
    },
    {
      id: '2',
      created_at: new Date().toISOString(),
      status: OrderStatus.OPEN,
      assigned_to: 'user@example.com',
      title: 'Order 2',
      description: 'Description 2',
    },
    {
      id: '3',
      created_at: new Date().toISOString(),
      status: OrderStatus.IN_PROGRESS,
      assigned_to: 'john@example.com',
      title: 'Order 3',
      description: 'Description 3',
    },
    {
      id: '4',
      created_at: new Date().toISOString(),
      status: OrderStatus.IN_PROGRESS,
      assigned_to: 'admin@example.com',
      title: 'Order 4',
      description: 'Description 4',
    },
    {
      id: '5',
      created_at: new Date().toISOString(),
      status: OrderStatus.PENDING,
      assigned_to: 'user@example.com',
      title: 'Order 5',
      description: 'Description 5',
    },
  ];

  getSummary(): IAnalyticsSummary {
    const orders = this.mockOrders;

    const ordersByStatus = {
      OPEN: orders.filter((o) => o.status === OrderStatus.OPEN).length,
      IN_PROGRESS: orders.filter((o) => o.status === OrderStatus.IN_PROGRESS).length,
      PENDING: orders.filter((o) => o.status === OrderStatus.PENDING).length,
    };

    const assignedOrders = orders.filter((o) => o.assigned_to !== null).length;
    const unassignedOrders = orders.filter((o) => o.assigned_to === null).length;

    return {
      totalOrders: orders.length,
      ordersByStatus,
      assignedOrders,
      unassignedOrders,
    };
  }
}
