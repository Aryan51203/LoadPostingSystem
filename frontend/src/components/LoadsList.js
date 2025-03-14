import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";
import Link from "next/link";
import { toast } from "react-toastify";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

const LoadsList = () => {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    keyword: "",
    cargoType: "",
    truckType: "",
    pickupState: "",
    pickupCity: "",
    deliveryState: "",
    deliveryCity: "",
    fromDate: "",
    toDate: "",
    minWeight: "",
    maxWeight: "",
    minBudget: "",
    maxBudget: "",
  });

  const fetchLoads = async (pageNum = 1, appliedFilters = filters) => {
    setLoading(true);

    try {
      // Build query params
      const params = new URLSearchParams();
      params.append("page", pageNum);

      // Add applied filters to query params
      Object.keys(appliedFilters).forEach((key) => {
        if (appliedFilters[key]) {
          params.append(key, appliedFilters[key]);
        }
      });

      const response = await axiosInstance.get(
        `/api/loads?${params.toString()}`
      );

      setLoads(response.data.data);
      setTotalPages(response.data.pagination.pages);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching loads:", error);
      toast.error("Failed to fetch loads. Please try again.");
      setLoads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchLoads(1, filters);
  };

  const resetFilters = () => {
    const resetFilters = {
      keyword: "",
      cargoType: "",
      truckType: "",
      pickupState: "",
      pickupCity: "",
      deliveryState: "",
      deliveryCity: "",
      fromDate: "",
      toDate: "",
      minWeight: "",
      maxWeight: "",
      minBudget: "",
      maxBudget: "",
    };

    setFilters(resetFilters);
    fetchLoads(1, resetFilters);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchLoads(newPage);
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Available Loads</h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
        >
          <FaFilter />
          <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Filter Loads</h3>

          <form onSubmit={applyFilters}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Keyword
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="keyword"
                    value={filters.keyword}
                    onChange={handleFilterChange}
                    placeholder="Search loads..."
                    className="pl-10 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cargo Type
                </label>
                <select
                  name="cargoType"
                  value={filters.cargoType}
                  onChange={handleFilterChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Types</option>
                  {cargoTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Truck Type
                </label>
                <select
                  name="truckType"
                  value={filters.truckType}
                  onChange={handleFilterChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">All Types</option>
                  {truckTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup State
                </label>
                <input
                  type="text"
                  name="pickupState"
                  value={filters.pickupState}
                  onChange={handleFilterChange}
                  placeholder="State"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup City
                </label>
                <input
                  type="text"
                  name="pickupCity"
                  value={filters.pickupCity}
                  onChange={handleFilterChange}
                  placeholder="City"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery State
                </label>
                <input
                  type="text"
                  name="deliveryState"
                  value={filters.deliveryState}
                  onChange={handleFilterChange}
                  placeholder="State"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery City
                </label>
                <input
                  type="text"
                  name="deliveryCity"
                  value={filters.deliveryCity}
                  onChange={handleFilterChange}
                  placeholder="City"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  name="fromDate"
                  value={filters.fromDate}
                  onChange={handleFilterChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  name="toDate"
                  value={filters.toDate}
                  onChange={handleFilterChange}
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Weight
                </label>
                <input
                  type="number"
                  name="minWeight"
                  value={filters.minWeight}
                  onChange={handleFilterChange}
                  placeholder="0"
                  min="0"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Weight
                </label>
                <input
                  type="number"
                  name="maxWeight"
                  value={filters.maxWeight}
                  onChange={handleFilterChange}
                  placeholder="Unlimited"
                  min="0"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Budget
                </label>
                <input
                  type="number"
                  name="minBudget"
                  value={filters.minBudget}
                  onChange={handleFilterChange}
                  placeholder="0"
                  min="0"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Budget
                </label>
                <input
                  type="number"
                  name="maxBudget"
                  value={filters.maxBudget}
                  onChange={handleFilterChange}
                  placeholder="Unlimited"
                  min="0"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={resetFilters}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md transition duration-300"
              >
                Reset
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : loads.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Loads Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters or check back later for new loads.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {loads.map((load) => (
              <div
                key={load._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {load.title}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      load.status === "Posted"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {load.status}
                  </span>
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <FaMapMarkerAlt className="text-red-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Pickup
                        </p>
                        <p className="text-sm text-gray-700">
                          {load.pickupLocation.city},{" "}
                          {load.pickupLocation.state}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(load.schedule.pickupDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Delivery
                        </p>
                        <p className="text-sm text-gray-700">
                          {load.deliveryLocation.city},{" "}
                          {load.deliveryLocation.state}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(load.schedule.deliveryDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    <div className="flex items-center space-x-2">
                      <FaTruck className="text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {load.cargoType}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FaCalendarAlt className="text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {load.weight.value} {load.weight.unit}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <FaMoneyBillWave className="text-green-500" />
                      <span className="text-sm font-medium text-gray-700">
                        {load.budget.currency} {load.budget.amount}
                        {load.budget.negotiable && (
                          <span className="text-xs text-gray-500">
                            {" "}
                            (Negotiable)
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Link href={`/loads/${load._id}`}>
                      <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        View Details
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-l-md 
                  ${
                    page === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {[...Array(totalPages).keys()].map((pageNum) => (
                  <button
                    key={pageNum + 1}
                    onClick={() => handlePageChange(pageNum + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium 
                    ${
                      page === pageNum + 1
                        ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium rounded-r-md 
                  ${
                    page === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoadsList;
