export interface ReportData {
  overview: {
    totalLoads: number;
    totalSpent: number;
    averageLoadCost: number;
    completionRate: number;
  };
  monthlySpending: {
    month: string;
    amount: number;
  }[];
  loadsByStatus: {
    status: string;
    count: number;
  }[];
  topRoutes: {
    route: string;
    count: number;
    averageCost: number;
  }[];
  carrierPerformance: {
    carrierName: string;
    completedLoads: number;
    averageRating: number;
    onTimeDelivery: number;
  }[];
}
