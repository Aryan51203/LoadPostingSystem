"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/utils/axiosInstance";

interface Load {
  _id: string;
  title: string;
  description: string;
  status: string;
  cargoType: string;
  weight: {
    value: number;
    unit: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  pickupLocation: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deliveryLocation: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  schedule: {
    pickupDate: string;
    deliveryDate: string;
  };
  budget: {
    amount: number;
    currency: string;
    negotiable: boolean;
  };
  bids: number;
  createdAt: string;
}

export default function LoadDetails() {
  const params = useParams();
  const router = useRouter();
  const [load, setLoad] = useState<Load | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoadDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/loads/${params.loadId}`);
        setLoad(response.data.data);
      } catch (error) {
        console.error("Error fetching load details:", error);
        toast.error("Failed to fetch load details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoadDetails();
  }, [params.loadId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this load?")) {
      return;
    }

    try {
      await axiosInstance.delete(`/api/loads/${params.loadId}`);
      toast.success("Load deleted successfully");
      router.push("/dashboard/shipper/loads");
    } catch (error) {
      console.error("Error deleting load:", error);
      toast.error("Failed to delete load. Please try again.");
    }
  };

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

  if (!load) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Load not found</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {load.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Created on {new Date(load.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/shipper/loads/${load._id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Load Information
              </h3>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                  load.status
                )}`}
              >
                {load.status}
              </span>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {load.description}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Cargo Type
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{load.cargoType}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {load.weight.value} {load.weight.unit}
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">
                  Dimensions
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {load.dimensions.length} x {load.dimensions.width} x{" "}
                  {load.dimensions.height} {load.dimensions.unit}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Pickup Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <p>{load.pickupLocation.address}</p>
                  <p>
                    {load.pickupLocation.city}, {load.pickupLocation.state}{" "}
                    {load.pickupLocation.zipCode}
                  </p>
                  <p>{load.pickupLocation.country}</p>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Delivery Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <p>{load.deliveryLocation.address}</p>
                  <p>
                    {load.deliveryLocation.city}, {load.deliveryLocation.state}{" "}
                    {load.deliveryLocation.zipCode}
                  </p>
                  <p>{load.deliveryLocation.country}</p>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Schedule</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <p>
                    Pickup:{" "}
                    {new Date(load.schedule.pickupDate).toLocaleDateString()}
                  </p>
                  <p>
                    Delivery:{" "}
                    {new Date(load.schedule.deliveryDate).toLocaleDateString()}
                  </p>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Budget</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <p>
                    {load.budget.currency} {load.budget.amount}
                  </p>
                  <p className="text-gray-500">
                    {load.budget.negotiable ? "Negotiable" : "Non-negotiable"}
                  </p>
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-gray-500">Bids</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {load.bids} {load.bids === 1 ? "bid" : "bids"}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/dashboard/shipper/loads"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            ← Back to Loads
          </Link>
        </div>
      </div>
    </div>
  );
}
