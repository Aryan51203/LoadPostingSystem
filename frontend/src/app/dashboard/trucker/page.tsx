"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/utils/axiosInstance";
import { toast } from "react-toastify";

interface Load {
  _id: string;
  title: string;
  status: string;
  pickupLocation: {
    city: string;
    state: string;
  };
  deliveryLocation: {
    city: string;
    state: string;
  };
  schedule: {
    pickupDate: string;
  };
  budget: {
    amount: number;
    currency: string;
  };
  shipper: {
    name: string;
    company: string;
  };
  createdAt: string;
}

interface DashboardStats {
  totalLoadsDelivered: number;
  activeLoadCount: number;
  totalEarnings: number;
  averageRating: number;
  onTimeDeliveryRate: number;
}

interface DashboardData {
  statistics: DashboardStats;
  currentLoads: Load[];
  availableLoads: Load[];
}

export default function TruckerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    statistics: {
      totalLoadsDelivered: 0,
      activeLoadCount: 0,
      totalEarnings: 0,
      averageRating: 0,
      onTimeDeliveryRate: 0,
    },
    currentLoads: [],
    availableLoads: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axiosInstance.get("/api/truckers/dashboard");
        setDashboardData(response.data.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to fetch dashboard data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { statistics } = dashboardData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {/* Stats Cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Loads Delivered
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statistics.totalLoadsDelivered}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Loads
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statistics.activeLoadCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Earnings
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${statistics.totalEarnings.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Rating
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {statistics.averageRating.toFixed(1)} / 5.0
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    On-Time Delivery
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {(statistics.onTimeDeliveryRate * 100).toFixed(1)}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Loads */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Current Loads
          </h3>
          <Link
            href="/dashboard/trucker/loads"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all loads
          </Link>
        </div>
        <div className="border-t border-gray-200">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {dashboardData.currentLoads.map((load) => (
                <li key={load._id}>
                  <Link
                    href={`/dashboard/trucker/loads/${load._id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {load.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${
                                load.status === "Assigned"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : load.status === "In Transit"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {load.status}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">
                            ${load.budget.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {load.pickupLocation.city},{" "}
                            {load.pickupLocation.state} →{" "}
                            {load.deliveryLocation.city},{" "}
                            {load.deliveryLocation.state}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p className="flex items-center">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {new Date(
                              load.schedule.pickupDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Available Loads */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Available Loads
          </h3>
          <Link
            href="/dashboard/trucker/loads/available"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all available loads
          </Link>
        </div>
        <div className="border-t border-gray-200">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
              {dashboardData.availableLoads.map((load) => (
                <li key={load._id}>
                  <Link
                    href={`/dashboard/trucker/loads/${load._id}`}
                    className="block hover:bg-gray-50"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {load.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {load.status}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="text-sm text-gray-500">
                            ${load.budget.amount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {load.pickupLocation.city},{" "}
                            {load.pickupLocation.state} →{" "}
                            {load.deliveryLocation.city},{" "}
                            {load.deliveryLocation.state}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <p className="flex items-center">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            {load.shipper.name} - {load.shipper.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
