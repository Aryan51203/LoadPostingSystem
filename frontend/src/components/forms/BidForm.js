import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";
import { toast } from "react-toastify";
import { FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

const BidForm = ({
  loadId,
  loadBudget,
  eligibilityCriteria,
  onBidPlaced,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    amount: "",
    message: "",
    proposedPickupDate: "",
    proposedDeliveryDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [truckerProfile, setTruckerProfile] = useState(null);
  const [eligibilityWarnings, setEligibilityWarnings] = useState([]);

  // Fetch trucker profile to check eligibility
  useEffect(() => {
    const fetchTruckerProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/truckers/me");
        setTruckerProfile(response.data.data);

        // Check eligibility if criteria exists
        if (eligibilityCriteria && response.data.data) {
          checkEligibility(response.data.data, eligibilityCriteria);
        }
      } catch (error) {
        console.error(
          "Error fetching trucker profile:",
          error.response?.data || error.message
        );
      }
    };

    fetchTruckerProfile();
  }, [eligibilityCriteria]);

  // Check trucker against eligibility criteria
  const checkEligibility = (trucker, criteria) => {
    const warnings = [];

    // Check accident history
    if (criteria.maxAccidentHistory !== undefined) {
      if (trucker.accidentHistory?.hasAccidents) {
        const accidentCount = trucker.accidentHistory.details?.length || 0;
        if (accidentCount > criteria.maxAccidentHistory) {
          warnings.push(
            `You have ${accidentCount} accidents in your history, but the maximum allowed is ${criteria.maxAccidentHistory}`
          );
        }
      }
    }

    // Check theft complaints
    if (criteria.maxTheftComplaints !== undefined) {
      if (trucker.theftComplaints?.hasComplaints) {
        const complaintCount = trucker.theftComplaints.details?.length || 0;
        if (complaintCount > criteria.maxTheftComplaints) {
          warnings.push(
            `You have ${complaintCount} theft complaints in your history, but the maximum allowed is ${criteria.maxTheftComplaints}`
          );
        }
      }
    }

    // Check truck age
    if (criteria.maxTruckAge !== undefined) {
      const currentYear = new Date().getFullYear();
      const truckAge = currentYear - trucker.truck?.year;
      if (truckAge > criteria.maxTruckAge) {
        warnings.push(
          `Your truck is ${truckAge} years old, but the maximum age allowed is ${criteria.maxTruckAge} years`
        );
      }
    }

    // Check driver license experience
    if (criteria.minExperienceYears !== undefined) {
      const issueDate = new Date(trucker.driverLicense?.issueDate);
      const today = new Date();
      const experienceYears = Math.floor(
        (today - issueDate) / (365.25 * 24 * 60 * 60 * 1000)
      );

      if (experienceYears < criteria.minExperienceYears) {
        warnings.push(
          `You have ${experienceYears} years of driving experience, but the minimum required is ${criteria.minExperienceYears} years`
        );
      }
    }

    setEligibilityWarnings(warnings);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there are eligibility warnings, confirm before proceeding
    if (eligibilityWarnings.length > 0) {
      if (
        !window.confirm(
          "You do not meet the eligibility criteria for this load. Your bid may be rejected. Do you still want to proceed?"
        )
      ) {
        return;
      }
    }

    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Format dates if provided
      const bidData = {
        loadId,
        amount: parseFloat(formData.amount),
        message: formData.message,
      };

      if (formData.proposedPickupDate) {
        bidData.proposedPickupDate = formData.proposedPickupDate;
      }

      if (formData.proposedDeliveryDate) {
        bidData.proposedDeliveryDate = formData.proposedDeliveryDate;
      }

      const response = await axiosInstance.post("/api/bids", bidData, config);

      toast.success("Bid placed successfully!");

      // Reset form
      setFormData({
        amount: "",
        message: "",
        proposedPickupDate: "",
        proposedDeliveryDate: "",
      });

      // Notify parent component
      if (onBidPlaced) {
        onBidPlaced(response.data.data);
      }
    } catch (error) {
      console.error(
        "Error placing bid:",
        error.response?.data || error.message
      );

      if (error.response?.data?.reasons) {
        // Show specific eligibility errors from server
        error.response.data.reasons.forEach((reason) => {
          toast.error(reason);
        });
      } else {
        toast.error(
          error.response?.data?.error || "Error placing bid. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Check if bid amount is lower than budget (if budget is provided)
  const isBidLowerThanBudget =
    loadBudget && formData.amount
      ? parseFloat(formData.amount) <= loadBudget.amount
      : true;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Place Your Bid</h3>

      {/* Eligibility Warning */}
      {eligibilityWarnings.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center mb-2">
            <FaExclamationTriangle className="text-red-500 mr-2" />
            <h4 className="font-medium text-red-700">Eligibility Warning</h4>
          </div>
          <p className="text-sm text-red-600 mb-2">
            You do not meet one or more of the eligibility criteria for this
            load:
          </p>
          <ul className="list-disc list-inside text-sm text-red-600">
            {eligibilityWarnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
          <p className="text-sm text-red-600 mt-2">
            Your bid may be rejected by the system. Consider finding another
            load that matches your qualifications.
          </p>
        </div>
      )}

      {/* Eligibility Info */}
      {eligibilityCriteria && eligibilityWarnings.length === 0 && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center mb-2">
            <FaInfoCircle className="text-green-500 mr-2" />
            <h4 className="font-medium text-green-700">
              You Meet All Eligibility Requirements
            </h4>
          </div>
          <p className="text-sm text-green-600">
            Your trucker profile meets all the required eligibility criteria for
            this load.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Bid Amount *
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
              step="0.01"
              min="0"
              className={`pl-7 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                formData.amount && !isBidLowerThanBudget ? "border-red-300" : ""
              }`}
              placeholder="Enter your bid amount"
            />
          </div>
          {loadBudget && formData.amount && !isBidLowerThanBudget && (
            <p className="mt-1 text-sm text-red-600">
              Your bid is higher than the shipper's budget of $
              {loadBudget.amount}
              {loadBudget.negotiable && " (though the price is negotiable)"}
            </p>
          )}
          {loadBudget && (
            <p className="mt-1 text-sm text-gray-500">
              Shipper's budget: ${loadBudget.amount}
              {loadBudget.negotiable && " (negotiable)"}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message to Shipper
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Add details about your service or why you're a good fit for this job..."
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">Max 300 characters</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposed Pickup Date
            </label>
            <input
              type="date"
              name="proposedPickupDate"
              value={formData.proposedPickupDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proposed Delivery Date
            </label>
            <input
              type="date"
              name="proposedDeliveryDate"
              value={formData.proposedDeliveryDate}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            }`}
          >
            {loading ? "Submitting..." : "Place Bid"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BidForm;
