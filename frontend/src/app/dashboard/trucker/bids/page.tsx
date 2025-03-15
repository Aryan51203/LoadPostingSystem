"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/lib/utils/axiosInstance";
import { toast } from "react-toastify";

interface Bid {
  _id: string;
  amount: number;
  status: string;
  notes?: string;
  createdAt: string;
  load: {
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
  };
}

export default function TruckerBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axiosInstance.get("/api/truckers/bids");
        setBids(response.data.data);
      } catch (error) {
        console.error("Error fetching bids:", error);
        toast.error("Failed to fetch bids. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const activeBids = bids.filter((bid) =>
    ["Pending", "Under Review"].includes(bid.status)
  );

  const pastBids = bids.filter((bid) =>
    ["Accepted", "Rejected", "Withdrawn"].includes(bid.status)
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Bids</h2>
        <Link
          href="/dashboard/trucker/loads/available"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Find Loads to Bid
        </Link>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("active")}
            className={`${
              activeTab === "active"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Active Bids ({activeBids.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`${
              activeTab === "past"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Past Bids ({pastBids.length})
          </button>
        </nav>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {(activeTab === "active" ? activeBids : pastBids).map((bid) => (
            <li key={bid._id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Link
                      href={`/dashboard/trucker/loads/${bid.load._id}`}
                      className="text-sm font-medium text-blue-600 truncate hover:text-blue-500"
                    >
                      {bid.load.title}
                    </Link>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          bid.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : bid.status === "Under Review"
                            ? "bg-blue-100 text-blue-800"
                            : bid.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : bid.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {bid.status}
                      </p>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="text-sm text-gray-500">
                      Your bid: ${bid.amount.toLocaleString()}
                    </p>
                    {bid.load.budget && (
                      <p className="ml-4 text-sm text-gray-500">
                        Budget: ${bid.load.budget.amount.toLocaleString()}
                      </p>
                    )}
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
                      {bid.load.pickupLocation.city},{" "}
                      {bid.load.pickupLocation.state} →{" "}
                      {bid.load.deliveryLocation.city},{" "}
                      {bid.load.deliveryLocation.state}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <div className="flex space-x-4">
                      <p className="flex items-center">
                        <svg
                          className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        {bid.load.shipper.name} - {bid.load.shipper.company}
                      </p>
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
                        Bid placed:{" "}
                        {new Date(bid.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                {bid.notes && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Notes: {bid.notes}</p>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
