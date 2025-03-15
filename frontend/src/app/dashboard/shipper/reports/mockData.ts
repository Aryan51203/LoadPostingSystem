import { ReportData } from "./types";

export const last7DaysData: ReportData = {
  overview: {
    totalLoads: 42,
    totalSpent: 84320.75,
    averageLoadCost: 2007.64,
    completionRate: 92.8,
  },
  monthlySpending: [
    { month: "Mon", amount: 12500 },
    { month: "Tue", amount: 13200 },
    { month: "Wed", amount: 11800 },
    { month: "Thu", amount: 14500 },
    { month: "Fri", amount: 13800 },
    { month: "Sat", amount: 9800 },
    { month: "Sun", amount: 8720 },
  ],
  loadsByStatus: [
    { status: "Completed", count: 39 },
    { status: "In Transit", count: 12 },
    { status: "Pending", count: 6 },
    { status: "Cancelled", count: 2 },
  ],
  topRoutes: [
    { route: "Phoenix, AZ → Las Vegas, NV", count: 8, averageCost: 1850.25 },
    {
      route: "Portland, OR → San Francisco, CA",
      count: 7,
      averageCost: 2100.75,
    },
    { route: "Boston, MA → Philadelphia, PA", count: 6, averageCost: 1650.5 },
    { route: "Austin, TX → New Orleans, LA", count: 5, averageCost: 1750.25 },
    { route: "Detroit, MI → Cleveland, OH", count: 4, averageCost: 1450.75 },
  ],
  carrierPerformance: [
    {
      carrierName: "Rapid Express",
      completedLoads: 15,
      averageRating: 4.9,
      onTimeDelivery: 98,
    },
    {
      carrierName: "Mountain Logistics",
      completedLoads: 12,
      averageRating: 4.7,
      onTimeDelivery: 95,
    },
    {
      carrierName: "Coast2Coast Carriers",
      completedLoads: 10,
      averageRating: 4.8,
      onTimeDelivery: 97,
    },
    {
      carrierName: "Metro Shipping",
      completedLoads: 8,
      averageRating: 4.6,
      onTimeDelivery: 94,
    },
    {
      carrierName: "Valley Transport",
      completedLoads: 7,
      averageRating: 4.5,
      onTimeDelivery: 93,
    },
  ],
};

export const last30DaysData: ReportData = {
  overview: {
    totalLoads: 156,
    totalSpent: 298450.25,
    averageLoadCost: 1913.14,
    completionRate: 93.5,
  },
  monthlySpending: [
    { month: "Week 1", amount: 75200 },
    { month: "Week 2", amount: 82400 },
    { month: "Week 3", amount: 71850 },
    { month: "Week 4", amount: 69000 },
  ],
  loadsByStatus: [
    { status: "Completed", count: 146 },
    { status: "In Transit", count: 28 },
    { status: "Pending", count: 12 },
    { status: "Cancelled", count: 5 },
  ],
  topRoutes: [
    { route: "Sacramento, CA → Seattle, WA", count: 25, averageCost: 2250.75 },
    { route: "Nashville, TN → Charlotte, NC", count: 22, averageCost: 1850.5 },
    {
      route: "Kansas City, MO → St. Louis, MO",
      count: 18,
      averageCost: 1450.25,
    },
    { route: "Minneapolis, MN → Chicago, IL", count: 16, averageCost: 1650.75 },
    {
      route: "Salt Lake City, UT → Denver, CO",
      count: 15,
      averageCost: 1750.5,
    },
  ],
  carrierPerformance: [
    {
      carrierName: "Summit Logistics",
      completedLoads: 42,
      averageRating: 4.8,
      onTimeDelivery: 96,
    },
    {
      carrierName: "CrossCountry Express",
      completedLoads: 38,
      averageRating: 4.7,
      onTimeDelivery: 95,
    },
    {
      carrierName: "Pacific Routes",
      completedLoads: 35,
      averageRating: 4.9,
      onTimeDelivery: 98,
    },
    {
      carrierName: "Midwest Movers",
      completedLoads: 32,
      averageRating: 4.6,
      onTimeDelivery: 94,
    },
    {
      carrierName: "Atlantic Transport",
      completedLoads: 28,
      averageRating: 4.5,
      onTimeDelivery: 93,
    },
  ],
};

export const last90DaysData: ReportData = {
  overview: {
    totalLoads: 425,
    totalSpent: 815670.5,
    averageLoadCost: 1919.22,
    completionRate: 94.2,
  },
  monthlySpending: [
    { month: "Month 1", amount: 275000 },
    { month: "Month 2", amount: 268450 },
    { month: "Month 3", amount: 272220 },
  ],
  loadsByStatus: [
    { status: "Completed", count: 401 },
    { status: "In Transit", count: 65 },
    { status: "Pending", count: 28 },
    { status: "Cancelled", count: 12 },
  ],
  topRoutes: [
    { route: "Dallas, TX → Memphis, TN", count: 58, averageCost: 1950.25 },
    {
      route: "Indianapolis, IN → Columbus, OH",
      count: 52,
      averageCost: 1550.75,
    },
    {
      route: "Pittsburgh, PA → Washington, DC",
      count: 45,
      averageCost: 1650.5,
    },
    { route: "Omaha, NE → Des Moines, IA", count: 42, averageCost: 1450.25 },
    { route: "Albuquerque, NM → El Paso, TX", count: 38, averageCost: 1550.75 },
  ],
  carrierPerformance: [
    {
      carrierName: "Continental Carriers",
      completedLoads: 95,
      averageRating: 4.8,
      onTimeDelivery: 97,
    },
    {
      carrierName: "Heartland Express",
      completedLoads: 88,
      averageRating: 4.7,
      onTimeDelivery: 95,
    },
    {
      carrierName: "United Logistics",
      completedLoads: 82,
      averageRating: 4.9,
      onTimeDelivery: 98,
    },
    {
      carrierName: "Regional Routes",
      completedLoads: 75,
      averageRating: 4.6,
      onTimeDelivery: 94,
    },
    {
      carrierName: "National Transport",
      completedLoads: 68,
      averageRating: 4.5,
      onTimeDelivery: 93,
    },
  ],
};
