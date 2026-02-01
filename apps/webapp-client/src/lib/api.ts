import { fetchJson } from '@turborepo/auth';
import type { ILoginResponse, IOrder, IUpdateOrder } from '@turborepo/dtos';

const API_AUTH_URL = 'http://localhost:3001';
const API_ORDERS_URL = 'http://localhost:3002';

export async function login(email: string): Promise<ILoginResponse> {
  const response = await fetch(`${API_AUTH_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }

  return response.json() as Promise<ILoginResponse>;
}

export async function getOrders(): Promise<IOrder[]> {
  return fetchJson<IOrder[]>(`${API_ORDERS_URL}/orders`);
}

export async function getOrder(id: string): Promise<IOrder> {
  return fetchJson<IOrder>(`${API_ORDERS_URL}/orders/${id}`);
}

export async function updateOrder(id: string, data: IUpdateOrder): Promise<IOrder> {
  return fetchJson<IOrder>(`${API_ORDERS_URL}/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}
