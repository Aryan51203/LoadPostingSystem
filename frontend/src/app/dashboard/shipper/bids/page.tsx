"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/utils/axiosInstance";

interface Bid {
  _id: string;
  load: {
    _id: string;
    title: string;
  };
  trucker: {
    _id: string;
    name: string;
  };
  amount: number;
  currency: string;
  message: string;
  proposedPickupDate: string;
  proposedDeliveryDate: string;
  status: string;
  isWinningBid: boolean;
  createdAt: string;
}

export default function ShipperBids() {
  const [bids, setBids] = useState<Bid[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await axiosInstance.get("/api/bids/shipper");
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

  const handleBidAction = async (
    bidId: string,
    action: "accept" | "reject"
  ) => {
    try {
      await axiosInstance.put(`/api/bids/${bidId}/${action}`);
      toast.success(`Bid ${action}ed successfully`);

      // Update bid status in the UI
      setBids((prevBids) =>
        prevBids.map((bid) =>
          bid._id === bidId
            ? { ...bid, status: action === "accept" ? "accepted" : "rejected" }
            : bid
        )
      );
    } catch (error) {
      console.error(`Error ${action}ing bid:`, error);
      toast.error(`Failed to ${action} bid. Please try again.`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredBids =
    filter === "all"
      ? bids
      : bids.filter((bid) => bid.status.toLowerCase() === filter);

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
          <h1 className="text-2xl font-semibold text-gray-900">Bids</h1>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Bids</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                {filteredBids.length === 0 ? (
                  <div className="text-center py-12 bg-white">
                    <p className="text-sm text-gray-500">No bids found</p>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Load
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Carrier
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Amount
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
                      {filteredBids.map((bid) => (
                        <tr key={bid._id}>
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <Link
                              href={`/dashboard/shipper/loads/${bid.load._id}`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              {bid.load.title}
                            </Link>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>{bid.trucker.name}</div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                            {bid.currency} {bid.amount}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <div>
                              Pickup:{" "}
                              {new Date(
                                bid.proposedPickupDate
                              ).toLocaleDateString()}
                            </div>
                            <div>
                              Delivery:{" "}
                              {new Date(
                                bid.proposedDeliveryDate
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                bid.status
                              )}`}
                            >
                              {bid.status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            {bid.status === "pending" && (
                              <div className="flex space-x-2 justify-end">
                                <button
                                  onClick={() =>
                                    handleBidAction(bid._id, "accept")
                                  }
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Accept
                                </button>
                                <button
                                  onClick={() =>
                                    handleBidAction(bid._id, "reject")
                                  }
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
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
