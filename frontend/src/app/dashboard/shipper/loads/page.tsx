"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/utils/axiosInstance";

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
  bids: number;
  createdAt: string;
}

export default function ShipperLoads() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        const response = await axiosInstance.get("/api/loads/shipper");
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

  const filteredLoads =
    filter === "all"
      ? loads
      : loads.filter((load) => load.status.toLowerCase() === filter);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "posted":
        return "bg-blue-100 text-blue-800";
      case "bidding":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-green-100 text-green-800";
      case "in transit":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">My Loads</h1>
          <Link
            href="/dashboard/shipper/loads/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Post New Load
          </Link>
        </div>

        <div className="mt-4">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <label className="sr-only">Filter loads</label>
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Loads</option>
                  <option value="posted">Posted</option>
                  <option value="bidding">Bidding</option>
                  <option value="assigned">Assigned</option>
                  <option value="in transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {filteredLoads.length === 0 ? (
                  <div className="text-center py-12 bg-white">
                    <p className="text-sm text-gray-500">No loads found</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Load Details
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Route
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Schedule
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Budget
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                        >
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredLoads.map((load) => (
                        <tr key={load._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="flex items-center">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {load.title}
                                </div>
                                <div className="text-gray-500">
                                  {load.bids} {load.bids === 1 ? "bid" : "bids"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>
                              {load.pickupLocation.city},{" "}
                              {load.pickupLocation.state}
                            </div>
                            <div>to</div>
                            <div>
                              {load.deliveryLocation.city},{" "}
                              {load.deliveryLocation.state}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>
                              Pickup:{" "}
                              {new Date(
                                load.schedule.pickupDate
                              ).toLocaleDateString()}
                            </div>
                            <div>
                              Delivery:{" "}
                              {new Date(
                                load.schedule.deliveryDate
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {load.budget.currency} {load.budget.amount}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                load.status
                              )}`}
                            >
                              {load.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link
                              href={`/dashboard/shipper/loads/${load._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                              <span className="sr-only">, {load.title}</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
