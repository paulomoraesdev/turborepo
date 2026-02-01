import { OrderStatus } from '@turborepo/dtos';
import type { ICreateOrder } from '@turborepo/dtos';

export class CreateOrderDto implements ICreateOrder {
  title: string;
  description: string;
  assigned_to?: string | null;
  status?: OrderStatus;
}
