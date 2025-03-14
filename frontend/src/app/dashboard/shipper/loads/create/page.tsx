"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/utils/axiosInstance";

interface FormData {
  title: string;
  description: string;
  cargoType: string;
  weight: {
    value: string;
    unit: string;
  };
  dimensions: {
    length: string;
    width: string;
    height: string;
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
    amount: string;
    currency: string;
    negotiable: boolean;
  };
  eligibilityCriteria: {
    minRating: number;
    minCompletedLoads: number;
    requiredEquipment: string[];
  };
}

export default function CreateLoad() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    cargoType: "General",
    weight: {
      value: "",
      unit: "tons",
    },
    dimensions: {
      length: "",
      width: "",
      height: "",
      unit: "m",
    },
    pickupLocation: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    deliveryLocation: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "USA",
    },
    schedule: {
      pickupDate: "",
      deliveryDate: "",
    },
    budget: {
      amount: "",
      currency: "USD",
      negotiable: false,
    },
    eligibilityCriteria: {
      minRating: 0,
      minCompletedLoads: 0,
      requiredEquipment: [],
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof FormData],
          [child]:
            type === "checkbox"
              ? (e.target as HTMLInputElement).checked
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post("/api/loads", formData);
      toast.success("Load created successfully!");
      router.push("/dashboard/shipper/loads");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(
          error.message || "An error occurred while creating the load"
        );
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Post a New Load
          </h3>
          <form onSubmit={handleSubmit} className="mt-5 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Load Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="cargoType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Cargo Type
                </label>
                <select
                  name="cargoType"
                  id="cargoType"
                  required
                  value={formData.cargoType}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="General">General</option>
                  <option value="Hazardous">Hazardous</option>
                  <option value="Perishable">Perishable</option>
                  <option value="Fragile">Fragile</option>
                  <option value="Heavy Machinery">Heavy Machinery</option>
                  <option value="Livestock">Livestock</option>
                  <option value="Vehicles">Vehicles</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Weight and Dimensions */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="weight.value"
                  className="block text-sm font-medium text-gray-700"
                >
                  Weight
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    name="weight.value"
                    id="weight.value"
                    required
                    value={formData.weight.value}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <select
                    name="weight.unit"
                    value={formData.weight.unit}
                    onChange={handleChange}
                    className="ml-2 border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="kg">kg</option>
                    <option value="tons">tons</option>
                    <option value="lb">lb</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="dimensions.length"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dimensions
                </label>
                <div className="mt-1 grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    name="dimensions.length"
                    id="dimensions.length"
                    placeholder="Length"
                    value={formData.dimensions.length}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <input
                    type="number"
                    name="dimensions.width"
                    id="dimensions.width"
                    placeholder="Width"
                    value={formData.dimensions.width}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <input
                    type="number"
                    name="dimensions.height"
                    id="dimensions.height"
                    placeholder="Height"
                    value={formData.dimensions.height}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <select
                  name="dimensions.unit"
                  value={formData.dimensions.unit}
                  onChange={handleChange}
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="cm">cm</option>
                  <option value="m">m</option>
                  <option value="in">in</option>
                  <option value="ft">ft</option>
                </select>
              </div>
            </div>

            {/* Locations */}
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Pickup Location
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="pickupLocation.address"
                    placeholder="Address"
                    required
                    value={formData.pickupLocation.address}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    name="pickupLocation.city"
                    placeholder="City"
                    required
                    value={formData.pickupLocation.city}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    name="pickupLocation.state"
                    placeholder="State"
                    required
                    value={formData.pickupLocation.state}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    name="pickupLocation.zipCode"
                    placeholder="ZIP Code"
                    required
                    value={formData.pickupLocation.zipCode}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  Delivery Location
                </h4>
                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    name="deliveryLocation.address"
                    placeholder="Address"
                    required
                    value={formData.deliveryLocation.address}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    name="deliveryLocation.city"
                    placeholder="City"
                    required
                    value={formData.deliveryLocation.city}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    name="deliveryLocation.state"
                    placeholder="State"
                    required
                    value={formData.deliveryLocation.state}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    name="deliveryLocation.zipCode"
                    placeholder="ZIP Code"
                    required
                    value={formData.deliveryLocation.zipCode}
                    onChange={handleChange}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="schedule.pickupDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pickup Date
                </label>
                <input
                  type="date"
                  name="schedule.pickupDate"
                  id="schedule.pickupDate"
                  required
                  value={formData.schedule.pickupDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="schedule.deliveryDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Delivery Date
                </label>
                <input
                  type="date"
                  name="schedule.deliveryDate"
                  id="schedule.deliveryDate"
                  required
                  value={formData.schedule.deliveryDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Budget */}
            <div>
              <label
                htmlFor="budget.amount"
                className="block text-sm font-medium text-gray-700"
              >
                Budget
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  $
                </span>
                <input
                  type="number"
                  name="budget.amount"
                  id="budget.amount"
                  required
                  value={formData.budget.amount}
                  onChange={handleChange}
                  className="block w-full border border-gray-300 rounded-none rounded-r-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-2 flex items-center">
                <input
                  type="checkbox"
                  name="budget.negotiable"
                  id="budget.negotiable"
                  checked={formData.budget.negotiable}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="budget.negotiable"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Budget is negotiable
                </label>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700">
                Eligibility Criteria
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="eligibilityCriteria.minRating"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Rating
                  </label>
                  <input
                    type="number"
                    name="eligibilityCriteria.minRating"
                    id="eligibilityCriteria.minRating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.eligibilityCriteria.minRating}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="eligibilityCriteria.minCompletedLoads"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Minimum Completed Loads
                  </label>
                  <input
                    type="number"
                    name="eligibilityCriteria.minCompletedLoads"
                    id="eligibilityCriteria.minCompletedLoads"
                    min="0"
                    value={formData.eligibilityCriteria.minCompletedLoads}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? "Creating..." : "Create Load"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
