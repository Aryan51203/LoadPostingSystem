import axiosInstance from "@/lib/utils/axiosInstance";
import React, { useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaCheck,
  FaMoneyBillWave,
  FaSpinner,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { toast } from "react-toastify";

const BidsList = ({ loadId, isShipper = false, loadStatus }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingBid, setAcceptingBid] = useState(null);

  const fetchBids = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/api/bids/load/${loadId}`);
      setBids(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching bids:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch bids. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadId) {
      fetchBids();
    }
  }, [loadId]);

  const handleAcceptBid = async (bidId) => {
    if (
      !window.confirm(
        "Are you sure you want to accept this bid? This will assign the load to this trucker."
      )
    ) {
      return;
    }

    setAcceptingBid(bidId);

    try {
      await axiosInstance.put(`/api/bids/${bidId}/accept`);

      toast.success("Bid accepted successfully!");

      // Refresh bids
      fetchBids();

      // If you have a callback to update parent load status
      if (window.updateLoadStatus) {
        window.updateLoadStatus();
      }
    } catch (error) {
      console.error(
        "Error accepting bid:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.error || "Error accepting bid. Please try again."
      );
    } finally {
      setAcceptingBid(null);
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Sort bids by amount (lowest first)
  const sortedBids = [...bids].sort((a, b) => a.amount - b.amount);

  const renderBidStatus = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "Accepted":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Accepted
          </span>
        );
      case "Rejected":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      case "Withdrawn":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            Withdrawn
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Is bidding still allowed on this load
  const canBid = ["Posted", "Bidding"].includes(loadStatus);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">
        Bids {bids.length > 0 && `(${bids.length})`}
        {!canBid && (
          <span className="ml-2 text-sm text-red-600">Bidding Closed</span>
        )}
      </h3>

      {loading ? (
        <div className="flex justify-center py-8">
          <FaSpinner className="animate-spin text-blue-600 text-3xl" />
        </div>
      ) : bids.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No bids have been placed yet.</p>
          {!isShipper && canBid && <p>Be the first to bid on this load!</p>}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedBids.map((bid) => (
            <div
              key={bid._id}
              className={`border rounded-lg p-4 ${
                bid.status === "Accepted"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:flex-1">
                  {/* Trucker Info */}
                  {isShipper && bid.trucker && (
                    <div className="flex items-start mb-3">
                      <FaUser className="text-gray-500 mt-1 mr-2" />
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {bid.trucker.companyName || "Unknown Trucker"}
                        </h4>
                        <div className="flex items-center mt-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < Math.floor(bid.trucker.rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                          <span className="ml-1 text-sm text-gray-600">
                            {bid.trucker.rating
                              ? bid.trucker.rating.toFixed(1)
                              : "Not rated"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bid Amount */}
                  <div className="flex items-center mb-2">
                    <FaMoneyBillWave className="text-green-500 mr-2" />
                    <span className="font-bold text-xl text-gray-900">
                      ${bid.amount.toFixed(2)}
                    </span>
                    <span className="ml-2 text-gray-500 text-sm">
                      {bid.currency}
                    </span>
                    {bid.status === "Pending" &&
                      sortedBids[0]._id === bid._id &&
                      sortedBids.length > 1 && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          Lowest Bid
                        </span>
                      )}
                  </div>

                  {/* Bid Status */}
                  <div className="mb-2">
                    {renderBidStatus(bid.status)}
                    <span className="ml-2 text-xs text-gray-500">
                      Placed on {new Date(bid.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="md:flex-1 md:pl-4 mt-3 md:mt-0">
                  {/* Message */}
                  {bid.message && (
                    <div className="mb-2 text-sm text-gray-700">
                      <p className="italic">&quot;{bid.message}&quot;</p>
                    </div>
                  )}

                  {/* Proposed Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    {bid.proposedPickupDate && (
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-500 mr-1" />
                        <span className="text-gray-600">
                          Pickup: {formatDate(bid.proposedPickupDate)}
                        </span>
                      </div>
                    )}

                    {bid.proposedDeliveryDate && (
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-gray-500 mr-1" />
                        <span className="text-gray-600">
                          Delivery: {formatDate(bid.proposedDeliveryDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Accept Button for Shipper */}
                {isShipper && bid.status === "Pending" && canBid && (
                  <div className="mt-3 md:mt-0 md:flex md:items-center">
                    <button
                      onClick={() => handleAcceptBid(bid._id)}
                      disabled={acceptingBid === bid._id}
                      className={`flex items-center justify-center w-full md:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                        ${
                          acceptingBid === bid._id
                            ? "bg-green-400 cursor-wait"
                            : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        }`}
                    >
                      {acceptingBid === bid._id ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" />
                          Accepting...
                        </>
                      ) : (
                        <>
                          <FaCheck className="mr-2" />
                          Accept Bid
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BidsList;
