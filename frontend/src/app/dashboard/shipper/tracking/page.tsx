"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/utils/axiosInstance";

interface Shipment {
  _id: string;
  load: {
    _id: string;
    title: string;
  };
  carrier: {
    companyName: string;
    contactNumber: string;
  };
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address: string;
    lastUpdated: string;
  };
  estimatedArrival: string;
  pickupLocation: {
    address: string;
    city: string;
    state: string;
  };
  deliveryLocation: {
    address: string;
    city: string;
    state: string;
  };
  milestones: {
    name: string;
    status: string;
    timestamp: string;
  }[];
}

export default function ShipperTracking() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await axiosInstance.get("/api/shipments/active");
        setShipments(response.data.data);
      } catch (error) {
        console.error("Error fetching shipments:", error);
        toast.error("Failed to fetch shipments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in transit":
        return "bg-blue-100 text-blue-800";
      case "delayed":
        return "bg-yellow-100 text-yellow-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "issue reported":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMilestoneColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-400";
      case "in progress":
        return "bg-blue-400";
      case "pending":
        return "bg-gray-200";
      default:
        return "bg-gray-200";
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
        <h1 className="text-2xl font-semibold text-gray-900">
          Shipment Tracking
        </h1>

        <div className="mt-8">
          {shipments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <p className="text-sm text-gray-500">No active shipments found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {shipments.map((shipment) => (
                <div
                  key={shipment._id}
                  className="bg-white shadow overflow-hidden sm:rounded-lg"
                >
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {shipment.load.title}
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          Carrier: {shipment.carrier.companyName}
                        </p>
                      </div>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          shipment.status
                        )}`}
                      >
                        {shipment.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Current Location
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <p>{shipment.currentLocation.address}</p>
                          <p className="text-xs text-gray-500">
                            Last updated:{" "}
                            {new Date(
                              shipment.currentLocation.lastUpdated
                            ).toLocaleString()}
                          </p>
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Estimated Arrival
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {new Date(shipment.estimatedArrival).toLocaleString()}
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Pickup Location
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <p>{shipment.pickupLocation.address}</p>
                          <p>
                            {shipment.pickupLocation.city},{" "}
                            {shipment.pickupLocation.state}
                          </p>
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Delivery Location
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <p>{shipment.deliveryLocation.address}</p>
                          <p>
                            {shipment.deliveryLocation.city},{" "}
                            {shipment.deliveryLocation.state}
                          </p>
                        </dd>
                      </div>

                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Milestones
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <div className="flow-root">
                            <ul className="-mb-8">
                              {shipment.milestones.map((milestone, index) => (
                                <li key={index}>
                                  <div className="relative pb-8">
                                    {index !==
                                      shipment.milestones.length - 1 && (
                                      <span
                                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                        aria-hidden="true"
                                      />
                                    )}
                                    <div className="relative flex space-x-3">
                                      <div>
                                        <span
                                          className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getMilestoneColor(
                                            milestone.status
                                          )}`}
                                        >
                                          <svg
                                            className="h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path
                                              fillRule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clipRule="evenodd"
                                            />
                                          </svg>
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                          <p className="text-sm text-gray-500">
                                            {milestone.name}
                                          </p>
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                          {new Date(
                                            milestone.timestamp
                                          ).toLocaleString()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </dd>
                      </div>

                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          Contact Information
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <p>Carrier: {shipment.carrier.companyName}</p>
                          <p>Phone: {shipment.carrier.contactNumber}</p>
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="bg-gray-50 px-4 py-4 sm:px-6">
                    <Link
                      href={`/dashboard/shipper/loads/${shipment.load._id}`}
                      className="text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      View Load Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
