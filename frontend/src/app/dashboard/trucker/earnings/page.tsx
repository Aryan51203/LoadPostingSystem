"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface EarningsData {
  totalEarnings: number;
  averageEarningsPerLoad: number;
  monthlyEarnings: { [key: string]: number };
  recentCompletedLoads: Array<{
    _id: string;
    title: string;
    status: string;
    completedAt: string;
    budget: {
      amount: number;
    };
    winningBid?: {
      amount: number;
    };
  }>;
}

export default function TruckerEarnings() {
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last90days");

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axiosInstance.get("/api/truckers/earnings");
        setEarningsData(response.data.data);
      } catch (error) {
        console.error("Error fetching earnings:", error);
        toast.error("Failed to fetch earnings data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEarnings();
  }, []);

  if (isLoading || !earningsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const chartData = Object.entries(earningsData.monthlyEarnings)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, amount]) => ({
      month: new Date(month).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      earnings: amount,
    }));

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
        <select
          className="mt-2 sm:mt-0 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="last30days">Last 30 Days</option>
          <option value="last90days">Last 90 Days</option>
          <option value="thisYear">This Year</option>
          <option value="allTime">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
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
                    ${earningsData.totalEarnings.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Average Per Load
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${earningsData.averageEarningsPerLoad.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    This Month
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    $
                    {(
                      earningsData.monthlyEarnings[
                        new Date().toISOString().slice(0, 7)
                      ] || 0
                    ).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Earnings Trend
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => [
                  `$${value.toLocaleString()}`,
                  "Earnings",
                ]}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Completed Loads
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {earningsData.recentCompletedLoads.map((load) => (
              <li key={load._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-blue-600 truncate">
                    {load.title}
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="text-sm text-gray-500">
                      $
                      {(
                        load.winningBid?.amount || load.budget.amount
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="flex items-center text-sm text-gray-500">
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
                    Completed: {new Date(load.completedAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                    >
                      {load.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
