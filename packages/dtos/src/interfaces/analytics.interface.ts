export interface IAnalyticsSummary {
  totalOrders: number;
  ordersByStatus: {
    OPEN: number;
    IN_PROGRESS: number;
    PENDING: number;
  };
  assignedOrders: number;
  unassignedOrders: number;
}
