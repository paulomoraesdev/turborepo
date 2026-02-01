import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { OrderStatus, UserRole } from '@turborepo/dtos';
import type { IOrder, IUser, ICreateOrder, IUpdateOrder } from '@turborepo/dtos';

@Injectable()
export class OrdersService {
  private orders: IOrder[] = [
    {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      status: OrderStatus.OPEN,
      assigned_to: null,
      title: 'Install new network equipment',
      description: 'Install and configure network switches in Building A',
    },
    {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      status: OrderStatus.IN_PROGRESS,
      assigned_to: 'john@example.com',
      title: 'Repair HVAC system',
      description: 'Fix the air conditioning unit on the 3rd floor',
    },
    {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      status: OrderStatus.PENDING,
      assigned_to: 'admin@example.com',
      title: 'Update server firmware',
      description: 'Apply critical security patches to all production servers',
    },
    {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      status: OrderStatus.OPEN,
      assigned_to: null,
      title: 'Replace office lighting',
      description: 'Replace fluorescent lights with LED panels in conference rooms',
    },
  ];

  findAll(user: IUser): IOrder[] {
    if (user.role === UserRole.ADMIN) {
      return [...this.orders];
    }

    return this.orders.filter(
      (order) => order.assigned_to === user.email || order.assigned_to === null
    );
  }

  findOne(id: string, user: IUser): IOrder {
    const order = this.orders.find((o) => o.id === id);

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (user.role !== UserRole.ADMIN) {
      if (order.assigned_to !== user.email && order.assigned_to !== null) {
        throw new ForbiddenException('You do not have access to this order');
      }
    }

    return order;
  }

  create(createOrderDto: ICreateOrder, user: IUser): IOrder {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can create orders');
    }

    const newOrder: IOrder = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      status: createOrderDto.status ?? OrderStatus.OPEN,
      assigned_to: createOrderDto.assigned_to ?? null,
      title: createOrderDto.title,
      description: createOrderDto.description,
    };

    this.orders.push(newOrder);
    return newOrder;
  }

  update(id: string, updateOrderDto: IUpdateOrder, user: IUser): IOrder {
    const orderIndex = this.orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    const order = this.orders[orderIndex];

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (user.role !== UserRole.ADMIN) {
      if (order.assigned_to !== user.email && order.assigned_to !== null) {
        throw new ForbiddenException('You do not have access to this order');
      }

      if (updateOrderDto.assigned_to !== undefined &&
          updateOrderDto.assigned_to !== user.email &&
          updateOrderDto.assigned_to !== null) {
        throw new ForbiddenException('You can only assign orders to yourself');
      }

      if (updateOrderDto.title !== undefined || updateOrderDto.description !== undefined) {
        throw new ForbiddenException('Only admins can modify order title and description');
      }
    }

    const updatedOrder: IOrder = {
      ...order,
      ...(updateOrderDto.title !== undefined && { title: updateOrderDto.title }),
      ...(updateOrderDto.description !== undefined && { description: updateOrderDto.description }),
      ...(updateOrderDto.status !== undefined && { status: updateOrderDto.status }),
      ...(updateOrderDto.assigned_to !== undefined && { assigned_to: updateOrderDto.assigned_to }),
    };

    this.orders[orderIndex] = updatedOrder;
    return updatedOrder;
  }

  remove(id: string, user: IUser): void {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can delete orders');
    }

    const orderIndex = this.orders.findIndex((o) => o.id === id);

    if (orderIndex === -1) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    this.orders.splice(orderIndex, 1);
  }
}
