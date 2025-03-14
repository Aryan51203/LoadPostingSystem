"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/utils/axiosInstance";

interface Payment {
  _id: string;
  load: {
    _id: string;
    title: string;
  };
  carrier: {
    companyName: string;
  };
  amount: number;
  currency: string;
  status: string;
  dueDate: string;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
}

export default function ShipperPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [totalAmount, setTotalAmount] = useState({
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axiosInstance.get("/api/payments/shipper");
        setPayments(response.data.data);

        // Calculate totals
        const totals = response.data.data.reduce(
          (acc: any, payment: Payment) => {
            if (payment.status.toLowerCase() === "pending") {
              acc.pending += payment.amount;
            } else if (payment.status.toLowerCase() === "completed") {
              acc.completed += payment.amount;
            }
            return acc;
          },
          { pending: 0, completed: 0 }
        );

        setTotalAmount(totals);
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast.error("Failed to fetch payments. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const handlePayment = async (paymentId: string) => {
    try {
      await axiosInstance.post(`/api/payments/${paymentId}/process`);
      toast.success("Payment processed successfully");

      // Update payment status in the UI
      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment._id === paymentId
            ? { ...payment, status: "completed" }
            : payment
        )
      );
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Failed to process payment. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPayments =
    filter === "all"
      ? payments
      : payments.filter((payment) => payment.status.toLowerCase() === filter);

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
        <h1 className="text-2xl font-semibold text-gray-900">Payments</h1>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Pending Payments
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalAmount.pending.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Completed Payments
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {totalAmount.completed.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Payments</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  {filteredPayments.length === 0 ? (
                    <div className="text-center py-12 bg-white">
                      <p className="text-sm text-gray-500">No payments found</p>
                    </div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Load
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Carrier
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Due Date
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Status
                          </th>
                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                          >
                            <span className="sr-only">Actions</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {filteredPayments.map((payment) => (
                          <tr key={payment._id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <Link
                                href={`/dashboard/shipper/loads/${payment.load._id}`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                {payment.load.title}
                              </Link>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {payment.carrier.companyName}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                              {payment.amount.toLocaleString("en-US", {
                                style: "currency",
                                currency: payment.currency,
                              })}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {new Date(payment.dueDate).toLocaleDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                  payment.status
                                )}`}
                              >
                                {payment.status}
                              </span>
                            </td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              {payment.status.toLowerCase() === "pending" && (
                                <button
                                  onClick={() => handlePayment(payment._id)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Process Payment
                                </button>
                              )}
                              {payment.status.toLowerCase() === "completed" &&
                                payment.transactionId && (
                                  <span className="text-gray-500">
                                    Transaction ID: {payment.transactionId}
                                  </span>
                                )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
