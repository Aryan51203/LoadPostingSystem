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
    deliveryDate: string;
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
  completedAt?: string;
}

export default function TruckerLoads() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"current" | "completed">(
    "current"
  );

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const response = await axiosInstance.get("/api/truckers/loads");
        setLoads(response.data.data);
      } catch (error) {
        console.error("Error fetching loads:", error);
        toast.error("Failed to fetch loads. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoads();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentLoads = loads.filter((load) =>
    ["Assigned", "In Transit"].includes(load.status)
  );

  const completedLoads = loads.filter((load) =>
    ["Delivered", "Completed"].includes(load.status)
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Loads</h2>
        <Link
          href="/dashboard/trucker/loads/available"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Find Available Loads
        </Link>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("current")}
            className={`${
              activeTab === "current"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Current Loads ({currentLoads.length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`${
              activeTab === "completed"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Completed Loads ({completedLoads.length})
          </button>
        </nav>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {(activeTab === "current" ? currentLoads : completedLoads).map(
            (load) => (
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
                              : load.status === "Delivered"
                              ? "bg-green-100 text-green-800"
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
                          {activeTab === "current"
                            ? `Pickup: ${new Date(
                                load.schedule.pickupDate
                              ).toLocaleDateString()}`
                            : `Completed: ${new Date(
                                load.completedAt || ""
                              ).toLocaleDateString()}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}
