"use client";

import axiosInstance from "@/lib/utils/axiosInstance";
import {
  Dialog,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Load {
  _id: string;
  title: string;
  status: string;
  description: string;
  pickupLocation: {
    city: string;
    state: string;
    address?: string;
    zipCode?: string;
  };
  deliveryLocation: {
    city: string;
    state: string;
    address?: string;
    zipCode?: string;
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
    _id: string;
    companyDetails: {
      name: string;
    };
    contactPerson: {
      name: string;
      phone: string;
    };
    rating: number;
  };
  requirements?: {
    truckType: string;
    capacity: string;
    specialRequirements?: string[];
  };
  distance: number;
  createdAt: string;
}

export default function AvailableLoads() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidNotes, setBidNotes] = useState("");
  const [proposedPickupDate, setProposedPickupDate] = useState("");
  const [proposedDeliveryDate, setProposedDeliveryDate] = useState("");
  const [filters, setFilters] = useState({
    minBudget: "",
    maxBudget: "",
    pickupDate: "",
  });

  useEffect(() => {
    fetchAvailableLoads();
  }, []);

  const fetchAvailableLoads = async () => {
    try {
      const response = await axiosInstance.get("/api/loads", {
        params: {
          ...filters,
          minBudget: filters.minBudget || undefined,
          maxBudget: filters.maxBudget || undefined,
          pickupDate: filters.pickupDate || undefined,
        },
      });
      console.log(response.data);
      setLoads(response.data.data);
    } catch (error) {
      console.error("Error fetching available loads:", error);
      toast.error("Failed to fetch available loads. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitBid = async () => {
    if (!selectedLoad || !bidAmount) return;

    try {
      await axiosInstance.post(`/api/bids`, {
        loadId: selectedLoad._id,
        amount: parseFloat(bidAmount),
        message: bidNotes,
        proposedPickupDate:
          proposedPickupDate || selectedLoad.schedule.pickupDate,
        proposedDeliveryDate:
          proposedDeliveryDate || selectedLoad.schedule.deliveryDate,
      });
      toast.success("Bid submitted successfully");
      setIsBidModalOpen(false);
      setBidAmount("");
      setBidNotes("");
      setProposedPickupDate("");
      setProposedDeliveryDate("");
      fetchAvailableLoads(); // Refresh the list
    } catch (error) {
      console.error("Error submitting bid:", error);
      toast.error("Failed to submit bid. Please try again.");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setIsLoading(true);
    fetchAvailableLoads();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Available Loads</h2>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="minBudget"
              className="block text-sm font-medium text-gray-700"
            >
              Min Budget
            </label>
            <input
              type="number"
              name="minBudget"
              id="minBudget"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Min $"
              value={filters.minBudget}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label
              htmlFor="maxBudget"
              className="block text-sm font-medium text-gray-700"
            >
              Max Budget
            </label>
            <input
              type="number"
              name="maxBudget"
              id="maxBudget"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Max $"
              value={filters.maxBudget}
              onChange={handleFilterChange}
            />
          </div>
          <div>
            <label
              htmlFor="pickupDate"
              className="block text-sm font-medium text-gray-700"
            >
              Pickup Date
            </label>
            <input
              type="date"
              name="pickupDate"
              id="pickupDate"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={filters.pickupDate}
              onChange={handleFilterChange}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={applyFilters}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {loads.map((load) => (
            <li key={load._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-medium text-blue-600 truncate">
                      {load.title}
                    </p>
                    <div className="ml-2 flex-shrink-0">
                      <p className="text-lg font-medium text-gray-900">
                        ${load.budget.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">{load.description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 sm:flex sm:justify-between">
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
                    {load.pickupLocation.city}, {load.pickupLocation.state} →{" "}
                    {load.deliveryLocation.city}, {load.deliveryLocation.state}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
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
                    Pickup:{" "}
                    {new Date(load.schedule.pickupDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLoad(load);
                      setIsBidModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Place Bid
                  </button>
                </div>
              </div>
              {load.requirements && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Requirements: {load.requirements.truckType},{" "}
                    {load.requirements.capacity}
                    {load.requirements.specialRequirements &&
                      load.requirements.specialRequirements.length > 0 &&
                      `, ${load.requirements.specialRequirements.join(", ")}`}
                  </p>
                </div>
              )}
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <p>Distance: {load.distance} miles</p>
                  <span className="mx-2">•</span>
                  <p>
                    Shipper: {load.shipper.contactPerson.name} (
                    {load.shipper.companyDetails.name})
                  </p>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <p className="ml-1">
                      {load.shipper.rating
                        ? load.shipper.rating.toFixed(1)
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Transition show={isBidModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setIsBidModalOpen}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                <div>
                  <div className="mt-3 sm:mt-5">
                    <DialogTitle
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Place Bid for {selectedLoad?.title}
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Load Budget: $
                        {selectedLoad?.budget.amount.toLocaleString()}
                      </p>
                      <div className="mt-4">
                        <label
                          htmlFor="bidAmount"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Your Bid Amount ($)
                        </label>
                        <input
                          type="number"
                          name="bidAmount"
                          id="bidAmount"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(e.target.value)}
                          placeholder="Enter your bid amount"
                        />
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="bidNotes"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Notes (Optional)
                        </label>
                        <textarea
                          id="bidNotes"
                          name="bidNotes"
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={bidNotes}
                          onChange={(e) => setBidNotes(e.target.value)}
                          placeholder="Add any notes about your bid"
                        />
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="proposedPickupDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Proposed Pickup Date
                        </label>
                        <input
                          type="date"
                          id="proposedPickupDate"
                          name="proposedPickupDate"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={proposedPickupDate}
                          onChange={(e) =>
                            setProposedPickupDate(e.target.value)
                          }
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="proposedDeliveryDate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Proposed Delivery Date
                        </label>
                        <input
                          type="date"
                          id="proposedDeliveryDate"
                          name="proposedDeliveryDate"
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={proposedDeliveryDate}
                          onChange={(e) =>
                            setProposedDeliveryDate(e.target.value)
                          }
                          min={
                            proposedPickupDate ||
                            new Date().toISOString().split("T")[0]
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                    onClick={handleSubmitBid}
                  >
                    Submit Bid
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    onClick={() => setIsBidModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
