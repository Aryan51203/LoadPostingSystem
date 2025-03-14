import React from "react";

interface TruckerRegistrationProps {
  formData: {
    driverLicense: {
      number: string;
      issueDate: string;
      expiryDate: string;
      state: string;
    };
    truck: {
      model: string;
      year: number;
      registrationNumber: string;
      capacity: number;
      type: string;
    };
  };
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export default function TruckerRegistration({
  formData,
  handleChange,
}: TruckerRegistrationProps) {
  return (
    <>
      <h3 className="text-lg font-medium text-gray-900">
        Driver License Information
      </h3>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="driverLicense.number"
            className="block text-sm font-medium text-gray-700"
          >
            License Number
          </label>
          <div className="mt-1">
            <input
              id="driverLicense.number"
              name="driverLicense.number"
              type="text"
              required
              value={formData.driverLicense.number}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="driverLicense.state"
            className="block text-sm font-medium text-gray-700"
          >
            Issuing State
          </label>
          <div className="mt-1">
            <input
              id="driverLicense.state"
              name="driverLicense.state"
              type="text"
              required
              value={formData.driverLicense.state}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="driverLicense.issueDate"
            className="block text-sm font-medium text-gray-700"
          >
            Issue Date
          </label>
          <div className="mt-1">
            <input
              id="driverLicense.issueDate"
              name="driverLicense.issueDate"
              type="date"
              required
              value={formData.driverLicense.issueDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 5 years ago
          </p>
        </div>

        <div>
          <label
            htmlFor="driverLicense.expiryDate"
            className="block text-sm font-medium text-gray-700"
          >
            Expiry Date
          </label>
          <div className="mt-1">
            <input
              id="driverLicense.expiryDate"
              name="driverLicense.expiryDate"
              type="date"
              required
              value={formData.driverLicense.expiryDate}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mt-6">
        Truck Information
      </h3>
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="truck.model"
            className="block text-sm font-medium text-gray-700"
          >
            Truck Model
          </label>
          <div className="mt-1">
            <input
              id="truck.model"
              name="truck.model"
              type="text"
              required
              value={formData.truck.model}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="truck.year"
            className="block text-sm font-medium text-gray-700"
          >
            Manufacturing Year
          </label>
          <div className="mt-1">
            <input
              id="truck.year"
              name="truck.year"
              type="number"
              required
              min={new Date().getFullYear() - 5}
              max={new Date().getFullYear()}
              value={formData.truck.year}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Must not be more than 5 years old
          </p>
        </div>

        <div>
          <label
            htmlFor="truck.registrationNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Registration Number
          </label>
          <div className="mt-1">
            <input
              id="truck.registrationNumber"
              name="truck.registrationNumber"
              type="text"
              required
              value={formData.truck.registrationNumber}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="truck.capacity"
            className="block text-sm font-medium text-gray-700"
          >
            Capacity (tons)
          </label>
          <div className="mt-1">
            <input
              id="truck.capacity"
              name="truck.capacity"
              type="number"
              required
              min="1"
              value={formData.truck.capacity}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="truck.type"
            className="block text-sm font-medium text-gray-700"
          >
            Truck Type
          </label>
          <div className="mt-1">
            <select
              id="truck.type"
              name="truck.type"
              required
              value={formData.truck.type}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="Flatbed">Flatbed</option>
              <option value="Refrigerated">Refrigerated</option>
              <option value="Container">Container</option>
              <option value="Tanker">Tanker</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
