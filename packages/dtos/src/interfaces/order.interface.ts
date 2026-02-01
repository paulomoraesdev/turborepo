import type { OrderStatus } from "../enums/order-status.enum";

export interface IOrder {
  id: string;
  created_at: string;
  status: OrderStatus;
  assigned_to: string | null;
  title: string;
  description: string;
}

export interface ICreateOrder {
  title: string;
  description: string;
  assigned_to?: string | null;
  status?: OrderStatus;
}

export interface IUpdateOrder {
  title?: string;
  description?: string;
  assigned_to?: string | null;
  status?: OrderStatus;
}
