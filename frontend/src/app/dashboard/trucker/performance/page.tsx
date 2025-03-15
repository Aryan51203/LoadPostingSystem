"use client";

import axiosInstance from "@/lib/utils/axiosInstance";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformanceData {
  overallRating: number;
  totalLoadsDelivered: number;
  onTimeDeliveryRate: number;
  loadAcceptanceRate: number;
  averageResponseTime: number;
  monthlyRatings: { [key: string]: number };
  recentReviews: Array<{
    _id: string;
    rating: number;
    comment: string;
    shipperName: string;
    loadTitle: string;
    createdAt: string;
  }>;
  performanceMetrics: {
    communicationScore: number;
    reliabilityScore: number;
    professionalismScore: number;
    cargoHandlingScore: number;
  };
}

export default function TruckerPerformance() {
  const [performanceData, setPerformanceData] =
    useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("last90days");

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/truckers/performance?timeRange=${timeRange}`
      );
      setPerformanceData(response.data.data);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      toast.error("Failed to fetch performance data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !performanceData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const ratingTrendData = Object.entries(performanceData.monthlyRatings)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, rating]) => ({
      month: new Date(month).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      rating,
    }));

  const performanceScores = [
    {
      name: "Communication",
      score: performanceData.performanceMetrics.communicationScore,
      fill: "#3B82F6",
    },
    {
      name: "Reliability",
      score: performanceData.performanceMetrics.reliabilityScore,
      fill: "#10B981",
    },
    {
      name: "Professionalism",
      score: performanceData.performanceMetrics.professionalismScore,
      fill: "#6366F1",
    },
    {
      name: "Cargo Handling",
      score: performanceData.performanceMetrics.cargoHandlingScore,
      fill: "#F59E0B",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Performance</h2>
        <select
          className="mt-2 sm:mt-0 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
        >
          <option value="last30days">Last 30 Days</option>
          <option value="last90days">Last 90 Days</option>
          <option value="thisYear">This Year</option>
          <option value="allTime">All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Overall Rating
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {performanceData.overallRating.toFixed(1)} / 5.0
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
                  className="h-6 w-6 text-green-400"
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
                    On-Time Delivery Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {(performanceData.onTimeDeliveryRate * 100).toFixed(1)}%
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
                  className="h-6 w-6 text-blue-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Load Acceptance Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {(performanceData.loadAcceptanceRate * 100).toFixed(1)}%
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
                  className="h-6 w-6 text-indigo-400"
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
                    Average Response Time
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {performanceData.averageResponseTime} mins
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Rating Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ratingTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="rating"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Performance Metrics
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="80%"
                data={performanceScores}
                startAngle={180}
                endAngle={0}
              >
                <RadialBar
                  minAngle={15}
                  label={{ fill: "#666", position: "insideStart" }}
                  background
                  clockWise={true}
                  dataKey="score"
                />
                <Legend
                  iconSize={10}
                  width={120}
                  height={140}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Reviews
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {performanceData.recentReviews.map((review) => (
              <li key={review._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-blue-600 truncate">
                    {review.loadTitle}
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-5 w-5 ${
                            i < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{review.comment}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <p>
                      By {review.shipperName} •{" "}
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
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
