import React, { useState } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const LoadPostForm = ({ initialData = null }) => {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    cargoType: initialData?.cargoType || "General",
    weight: {
      value: initialData?.weight?.value || "",
      unit: initialData?.weight?.unit || "tons",
    },
    dimensions: {
      length: initialData?.dimensions?.length || "",
      width: initialData?.dimensions?.width || "",
      height: initialData?.dimensions?.height || "",
      unit: initialData?.dimensions?.unit || "m",
    },
    pickupLocation: {
      address: initialData?.pickupLocation?.address || "",
      city: initialData?.pickupLocation?.city || "",
      state: initialData?.pickupLocation?.state || "",
      zipCode: initialData?.pickupLocation?.zipCode || "",
      country: initialData?.pickupLocation?.country || "USA",
    },
    deliveryLocation: {
      address: initialData?.deliveryLocation?.address || "",
      city: initialData?.deliveryLocation?.city || "",
      state: initialData?.deliveryLocation?.state || "",
      zipCode: initialData?.deliveryLocation?.zipCode || "",
      country: initialData?.deliveryLocation?.country || "USA",
    },
    schedule: {
      pickupDate: initialData?.schedule?.pickupDate
        ? new Date(initialData.schedule.pickupDate).toISOString().split("T")[0]
        : "",
      pickupTimeWindow: {
        from: initialData?.schedule?.pickupTimeWindow?.from || "",
        to: initialData?.schedule?.pickupTimeWindow?.to || "",
      },
      deliveryDate: initialData?.schedule?.deliveryDate
        ? new Date(initialData.schedule.deliveryDate)
            .toISOString()
            .split("T")[0]
        : "",
      deliveryTimeWindow: {
        from: initialData?.schedule?.deliveryTimeWindow?.from || "",
        to: initialData?.schedule?.deliveryTimeWindow?.to || "",
      },
      flexibleDates: initialData?.schedule?.flexibleDates || false,
    },
    budget: {
      amount: initialData?.budget?.amount || "",
      currency: initialData?.budget?.currency || "USD",
      negotiable:
        initialData?.budget?.negotiable !== undefined
          ? initialData.budget.negotiable
          : true,
    },
    requiredTruckType: initialData?.requiredTruckType || "Any",
    specialRequirements: initialData?.specialRequirements || [],
    eligibilityCriteria: {
      maxAccidentHistory:
        initialData?.eligibilityCriteria?.maxAccidentHistory !== undefined
          ? initialData.eligibilityCriteria.maxAccidentHistory
          : 0,
      maxTheftComplaints:
        initialData?.eligibilityCriteria?.maxTheftComplaints !== undefined
          ? initialData.eligibilityCriteria.maxTheftComplaints
          : 0,
      maxTruckAge:
        initialData?.eligibilityCriteria?.maxTruckAge !== undefined
          ? initialData.eligibilityCriteria.maxTruckAge
          : 5,
      minExperienceYears:
        initialData?.eligibilityCriteria?.minExperienceYears !== undefined
          ? initialData.eligibilityCriteria.minExperienceYears
          : 5,
      additionalRequirements:
        initialData?.eligibilityCriteria?.additionalRequirements || [],
    },
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleEligibilityChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      eligibilityCriteria: {
        ...formData.eligibilityCriteria,
        [name]: value === "" ? "" : Number(value),
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      let response;

      if (isEditing) {
        response = await axiosInstance.put(
          `/api/loads/${initialData._id}`,
          formData,
          config
        );
        toast.success("Load updated successfully!");
      } else {
        response = await axiosInstance.post("/api/loads", formData, config);
        toast.success("Load posted successfully!");
      }

      router.push(`/loads/${response.data.data._id}`);
    } catch (error) {
      console.error(
        "Error posting load:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.error || "Failed to post load. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const cargoTypes = [
    "General",
    "Hazardous",
    "Perishable",
    "Fragile",
    "Heavy Machinery",
    "Livestock",
    "Vehicles",
    "Other",
  ];

  const truckTypes = [
    "Flatbed",
    "Refrigerated",
    "Container",
    "Tanker",
    "Any",
    "Other",
  ];

  const [additionalRequirement, setAdditionalRequirement] = useState("");

  const handleAddRequirement = () => {
    if (additionalRequirement.trim() !== "") {
      setFormData({
        ...formData,
        specialRequirements: [
          ...formData.specialRequirements,
          additionalRequirement.trim(),
        ],
      });
      setAdditionalRequirement("");
    }
  };

  const [
    additionalEligibilityRequirement,
    setAdditionalEligibilityRequirement,
  ] = useState("");

  const handleAddEligibilityRequirement = () => {
    if (additionalEligibilityRequirement.trim() !== "") {
      setFormData({
        ...formData,
        eligibilityCriteria: {
          ...formData.eligibilityCriteria,
          additionalRequirements: [
            ...formData.eligibilityCriteria.additionalRequirements,
            additionalEligibilityRequirement.trim(),
          ],
        },
      });
      setAdditionalEligibilityRequirement("");
    }
  };

  const handleRemoveRequirement = (index) => {
    setFormData({
      ...formData,
      specialRequirements: formData.specialRequirements.filter(
        (_, i) => i !== index
      ),
    });
  };

  const handleRemoveEligibilityRequirement = (index) => {
    setFormData({
      ...formData,
      eligibilityCriteria: {
        ...formData.eligibilityCriteria,
        additionalRequirements:
          formData.eligibilityCriteria.additionalRequirements.filter(
            (_, i) => i !== index
          ),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Load Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="e.g. Furniture Transport from NYC to LA"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cargo Type *
            </label>
            <select
              name="cargoType"
              value={formData.cargoType}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {cargoTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Provide details about your cargo"
          ></textarea>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Cargo Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (Value) *
            </label>
            <input
              type="number"
              name="weight.value"
              value={formData.weight.value}
              onChange={handleChange}
              required
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight Unit
            </label>
            <select
              name="weight.unit"
              value={formData.weight.unit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="tons">Tons</option>
              <option value="lb">Pounds (lb)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Required Truck Type
            </label>
            <select
              name="requiredTruckType"
              value={formData.requiredTruckType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {truckTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Length
            </label>
            <input
              type="number"
              name="dimensions.length"
              value={formData.dimensions.length}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Width
            </label>
            <input
              type="number"
              name="dimensions.width"
              value={formData.dimensions.width}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Height
            </label>
            <input
              type="number"
              name="dimensions.height"
              value={formData.dimensions.height}
              onChange={handleChange}
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Dimension Unit
            </label>
            <select
              name="dimensions.unit"
              value={formData.dimensions.unit}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="cm">Centimeters (cm)</option>
              <option value="m">Meters (m)</option>
              <option value="in">Inches (in)</option>
              <option value="ft">Feet (ft)</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Special Requirements (comma separated)
          </label>
          <input
            type="text"
            name="specialRequirements"
            value={formData.specialRequirements.join(", ")}
            onChange={(e) =>
              setFormData({
                ...formData,
                specialRequirements: e.target.value
                  .split(",")
                  .map((item) => item.trim()),
              })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g. Tail lift, Temperature control, etc."
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Pickup Location</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <input
              type="text"
              name="pickupLocation.address"
              value={formData.pickupLocation.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              name="pickupLocation.city"
              value={formData.pickupLocation.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              State *
            </label>
            <input
              type="text"
              name="pickupLocation.state"
              value={formData.pickupLocation.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ZIP Code *
            </label>
            <input
              type="text"
              name="pickupLocation.zipCode"
              value={formData.pickupLocation.zipCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Delivery Location</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Address *
            </label>
            <input
              type="text"
              name="deliveryLocation.address"
              value={formData.deliveryLocation.address}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              City *
            </label>
            <input
              type="text"
              name="deliveryLocation.city"
              value={formData.deliveryLocation.city}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              State *
            </label>
            <input
              type="text"
              name="deliveryLocation.state"
              value={formData.deliveryLocation.state}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              ZIP Code *
            </label>
            <input
              type="text"
              name="deliveryLocation.zipCode"
              value={formData.deliveryLocation.zipCode}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Schedule</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Pickup Date *
            </label>
            <input
              type="date"
              name="schedule.pickupDate"
              value={formData.schedule.pickupDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Delivery Date *
            </label>
            <input
              type="date"
              name="schedule.deliveryDate"
              value={formData.schedule.deliveryDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="schedule.flexibleDates"
              checked={formData.schedule.flexibleDates}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Flexible Dates
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Budget</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount *
            </label>
            <input
              type="number"
              name="budget.amount"
              value={formData.budget.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Currency
            </label>
            <select
              name="budget.currency"
              value={formData.budget.currency}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>

          <div className="flex items-center mt-8">
            <input
              type="checkbox"
              name="budget.negotiable"
              checked={formData.budget.negotiable}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Price Negotiable
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">
          Trucker Eligibility Criteria
        </h3>

        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="maxAccidentHistory"
              className="block text-sm font-medium text-gray-700"
            >
              Maximum Accident History
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="maxAccidentHistory"
                name="maxAccidentHistory"
                min="0"
                value={formData.eligibilityCriteria.maxAccidentHistory}
                onChange={handleEligibilityChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">
                Set to 0 for no accidents allowed
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="maxTheftComplaints"
              className="block text-sm font-medium text-gray-700"
            >
              Maximum Theft Complaints
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="maxTheftComplaints"
                name="maxTheftComplaints"
                min="0"
                value={formData.eligibilityCriteria.maxTheftComplaints}
                onChange={handleEligibilityChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">
                Set to 0 for no theft complaints allowed
              </p>
            </div>
          </div>

          <div>
            <label
              htmlFor="maxTruckAge"
              className="block text-sm font-medium text-gray-700"
            >
              Maximum Truck Age (Years)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="maxTruckAge"
                name="maxTruckAge"
                min="0"
                value={formData.eligibilityCriteria.maxTruckAge}
                onChange={handleEligibilityChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="minExperienceYears"
              className="block text-sm font-medium text-gray-700"
            >
              Minimum Experience (Years)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="minExperienceYears"
                name="minExperienceYears"
                min="0"
                value={formData.eligibilityCriteria.minExperienceYears}
                onChange={handleEligibilityChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
              <p className="mt-1 text-xs text-gray-500">
                Years since driver's license issue date
              </p>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="additionalEligibilityRequirement"
              className="block text-sm font-medium text-gray-700"
            >
              Additional Requirements
            </label>
            <div className="mt-1 flex">
              <input
                type="text"
                id="additionalEligibilityRequirement"
                value={additionalEligibilityRequirement}
                onChange={(e) =>
                  setAdditionalEligibilityRequirement(e.target.value)
                }
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="e.g., Must have hazardous materials certification"
              />
              <button
                type="button"
                onClick={handleAddEligibilityRequirement}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>

            {formData.eligibilityCriteria.additionalRequirements.length > 0 && (
              <div className="mt-2">
                <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                  {formData.eligibilityCriteria.additionalRequirements.map(
                    (req, index) => (
                      <li
                        key={index}
                        className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                      >
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            {req}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveEligibilityRequirement(index)
                            }
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-200 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-4"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className={`${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          } py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
        >
          {loading ? "Submitting..." : isEditing ? "Update Load" : "Post Load"}
        </button>
      </div>
    </form>
  );
};

export default LoadPostForm;
