import { OrderStatus } from '@turborepo/dtos';
import type { IUpdateOrder } from '@turborepo/dtos';

export class UpdateOrderDto implements IUpdateOrder {
  title?: string;
  description?: string;
  assigned_to?: string | null;
  status?: OrderStatus;
}
