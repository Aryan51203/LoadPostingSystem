import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaPlus,
  FaMinus,
  FaSpinner,
} from "react-icons/fa";
import BidForm from "./forms/BidForm";
import BidsList from "./BidsList";

const LoadDetails = ({ loadId, userType }) => {
  const router = useRouter();
  const [load, setLoad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const isShipper = userType === "shipper";
  const isTrucker = userType === "trucker";

  const fetchLoad = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get(`/api/loads/${loadId}`);
      setLoad(response.data.data);
    } catch (error) {
      console.error(
        "Error fetching load:",
        error.response?.data || error.message
      );
      toast.error("Failed to fetch load details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loadId) {
      fetchLoad();
    }
  }, [loadId, refreshKey]);

  const refreshLoadData = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  // Make refresh function available globally for other components to call
  window.updateLoadStatus = refreshLoadData;

  const handleBidPlaced = () => {
    setShowBidForm(false);
    refreshLoadData();
    toast.success("Your bid has been placed successfully!");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Check if user can bid on this load
  const canBid =
    isTrucker && load && ["Posted", "Bidding"].includes(load.status);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
      </div>
    );
  }

  if (!load) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          Load Not Found
        </h3>
        <p className="text-gray-500 mb-4">
          The load you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => router.push("/loads")}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Loads
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Load Status Banner */}
      <div
        className={`
        py-3 px-4 rounded-lg shadow-sm text-white font-medium flex justify-between items-center
        ${
          load.status === "Posted"
            ? "bg-green-600"
            : load.status === "Bidding"
            ? "bg-blue-600"
            : load.status === "Assigned"
            ? "bg-purple-600"
            : load.status === "In Transit"
            ? "bg-orange-600"
            : load.status === "Delivered"
            ? "bg-teal-600"
            : load.status === "Completed"
            ? "bg-green-700"
            : "bg-gray-600"
        }`}
      >
        <span>Status: {load.status}</span>

        {canBid && (
          <button
            onClick={() => setShowBidForm(!showBidForm)}
            className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium bg-white text-blue-600 hover:bg-blue-50"
          >
            {showBidForm ? (
              <>
                <FaMinus className="mr-1" /> Hide Bid Form
              </>
            ) : (
              <>
                <FaPlus className="mr-1" /> Place Bid
              </>
            )}
          </button>
        )}
      </div>

      {/* Load Details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800">{load.title}</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Load Information
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">
                    Description
                  </h4>
                  <p className="text-gray-800 mt-1">{load.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Cargo Type
                    </h4>
                    <p className="text-gray-800 mt-1">{load.cargoType}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Weight
                    </h4>
                    <p className="text-gray-800 mt-1">
                      {load.weight.value} {load.weight.unit}
                    </p>
                  </div>
                </div>

                {load.dimensions && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Dimensions
                    </h4>
                    <p className="text-gray-800 mt-1">
                      {load.dimensions.length
                        ? `L: ${load.dimensions.length}`
                        : ""}
                      {load.dimensions.width
                        ? ` × W: ${load.dimensions.width}`
                        : ""}
                      {load.dimensions.height
                        ? ` × H: ${load.dimensions.height}`
                        : ""}
                      {load.dimensions.unit ? ` ${load.dimensions.unit}` : ""}
                    </p>
                  </div>
                )}

                {load.requiredTruckType && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">
                      Required Truck Type
                    </h4>
                    <div className="flex items-center mt-1">
                      <FaTruck className="text-gray-500 mr-2" />
                      <span className="text-gray-800">
                        {load.requiredTruckType}
                      </span>
                    </div>
                  </div>
                )}

                {load.specialRequirements &&
                  load.specialRequirements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Special Requirements
                      </h4>
                      <ul className="list-disc list-inside text-gray-800 mt-1">
                        {load.specialRequirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Trucker Eligibility Criteria */}
                {load.eligibilityCriteria && (
                  <div className="mt-6 p-4 border border-yellow-200 bg-yellow-50 rounded-md">
                    <h4 className="text-md font-semibold mb-2 text-gray-800 flex items-center">
                      <FaTruck className="text-yellow-500 mr-2" />
                      Trucker Eligibility Requirements
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>
                          Accidents:{" "}
                          <span className="font-medium">
                            {load.eligibilityCriteria.maxAccidentHistory === 0
                              ? "No accidents allowed"
                              : `Maximum ${load.eligibilityCriteria.maxAccidentHistory} accidents`}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>
                          Theft complaints:{" "}
                          <span className="font-medium">
                            {load.eligibilityCriteria.maxTheftComplaints === 0
                              ? "No theft complaints allowed"
                              : `Maximum ${load.eligibilityCriteria.maxTheftComplaints} theft complaints`}
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>
                          Truck age:{" "}
                          <span className="font-medium">
                            Maximum {load.eligibilityCriteria.maxTruckAge} years
                            old
                          </span>
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>
                          Driving experience:{" "}
                          <span className="font-medium">
                            Minimum{" "}
                            {load.eligibilityCriteria.minExperienceYears} years
                          </span>
                        </span>
                      </li>
                      {load.eligibilityCriteria.additionalRequirements &&
                        load.eligibilityCriteria.additionalRequirements.length >
                          0 && (
                          <>
                            {load.eligibilityCriteria.additionalRequirements.map(
                              (req, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-yellow-600 mr-2">
                                    •
                                  </span>
                                  <span>{req}</span>
                                </li>
                              )
                            )}
                          </>
                        )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-800">
                Logistics Details
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-3 py-2">
                  <h4 className="text-sm font-medium text-gray-500">
                    Pickup Location
                  </h4>
                  <div className="flex items-start mt-1">
                    <FaMapMarkerAlt className="text-red-500 mt-1 mr-2" />
                    <div>
                      <p className="text-gray-800">
                        {load.pickupLocation.address}
                      </p>
                      <p className="text-gray-800">
                        {load.pickupLocation.city}, {load.pickupLocation.state}{" "}
                        {load.pickupLocation.zipCode}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        <FaCalendarAlt className="inline mr-1" />
                        {formatDate(load.schedule.pickupDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-3 py-2">
                  <h4 className="text-sm font-medium text-gray-500">
                    Delivery Location
                  </h4>
                  <div className="flex items-start mt-1">
                    <FaMapMarkerAlt className="text-blue-500 mt-1 mr-2" />
                    <div>
                      <p className="text-gray-800">
                        {load.deliveryLocation.address}
                      </p>
                      <p className="text-gray-800">
                        {load.deliveryLocation.city},{" "}
                        {load.deliveryLocation.state}{" "}
                        {load.deliveryLocation.zipCode}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        <FaCalendarAlt className="inline mr-1" />
                        {formatDate(load.schedule.deliveryDate)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <h4 className="text-sm font-medium text-gray-500">Budget</h4>
                  <div className="flex items-center mt-1">
                    <FaMoneyBillWave className="text-green-500 mr-2" />
                    <span className="text-gray-800 font-bold text-xl">
                      {load.budget.currency}{" "}
                      {load.budget.amount.toLocaleString()}
                    </span>
                    {load.budget.negotiable && (
                      <span className="ml-2 text-sm text-gray-600">
                        (Negotiable)
                      </span>
                    )}
                  </div>
                </div>

                {/* Shipper Information */}
                {load.shipper && (
                  <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <h4 className="text-sm font-medium text-gray-500">
                      Shipper Information
                    </h4>
                    <div className="mt-1">
                      <p className="text-gray-800 font-medium">
                        {load.shipper.companyName}
                      </p>
                      {isShipper ||
                      load.status === "Assigned" ||
                      load.status === "In Transit" ? (
                        <>
                          <p className="text-gray-600 text-sm mt-1">
                            Contact: {load.shipper.contactName}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Phone: {load.shipper.contactPhone}
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-600 text-sm mt-1">
                          Contact information will be available once assigned
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid Form (for truckers) */}
      {showBidForm && canBid && (
        <BidForm
          loadId={loadId}
          loadBudget={load.budget}
          eligibilityCriteria={load.eligibilityCriteria}
          onBidPlaced={handleBidPlaced}
          onCancel={() => setShowBidForm(false)}
        />
      )}

      {/* Bids List */}
      <BidsList
        loadId={loadId}
        isShipper={isShipper}
        loadStatus={load.status}
      />
    </div>
  );
};

export default LoadDetails;
