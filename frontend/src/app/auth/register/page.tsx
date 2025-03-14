"use client";

import axiosInstance from "@/lib/utils/axiosInstance";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ShipperRegistration from "./components/ShipperRegistration";
import TruckerRegistration from "./components/TruckerRegistration";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  role: string;
  companyName: string;
  contactName: string;
  contactPhone: string;
  address: string;
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
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "";

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: role || "shipper",
    phoneNumber: "",
    // Shipper fields
    companyName: "",
    contactName: "",
    contactPhone: "",
    address: "",
    // Trucker fields
    driverLicense: {
      number: "",
      issueDate: "",
      expiryDate: "",
      state: "",
    },
    truck: {
      model: "",
      year: new Date().getFullYear() - 2, // Default to 2 years old
      registrationNumber: "",
      capacity: 20,
      type: "Flatbed",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  // Update role when URL parameter changes
  useEffect(() => {
    if (role) {
      setFormData((prev) => ({ ...prev, role }));
    }
  }, [role]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Register user first
      const userResponse = await axiosInstance.post("/api/auth/register", {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.contactPhone,
        name: formData.contactName,
      });

      // Register role-specific profile based on role

      if (formData.role === "shipper") {
        await axiosInstance.post("/api/shippers", {
          companyName: formData.companyName,
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          address: formData.address,
        });

        toast.success("Shipper account created successfully!");
      } else if (formData.role === "trucker") {
        await axiosInstance.post("/api/truckers", {
          driverLicense: formData.driverLicense,
          truck: formData.truck,
        });

        toast.success("Trucker account created successfully!");
      }

      // Redirect to dashboard based on user role
      router.push(`/dashboard/${userResponse.data.user.role}`);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorResponse = error as {
        response?: { data?: { error?: string } };
      };
      console.error(
        "Registration error:",
        errorResponse.response?.data || errorMessage
      );
      toast.error(
        errorResponse.response?.data?.error ||
          "Failed to register. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Role Selection */}
          <div className="mb-6">
            <div className="flex justify-center space-x-4">
              <Link
                href="/auth/register?role=shipper"
                className={`flex-1 py-2 px-4 text-center rounded-md ${
                  formData.role === "shipper"
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Shipper
              </Link>
              <Link
                href="/auth/register?role=trucker"
                className={`flex-1 py-2 px-4 text-center rounded-md ${
                  formData.role === "trucker"
                    ? "bg-blue-600 text-white font-medium"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Trucker
              </Link>
            </div>
            <p className="mt-2 text-center text-sm text-gray-500">
              {formData.role === "shipper"
                ? "Register as a shipper to post freight loads"
                : "Register as a trucker to find loads and earn"}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email & Password */}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  autoComplete="phoneNumber"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Role-specific fields */}
            {formData.role === "shipper" ? (
              <ShipperRegistration
                formData={formData}
                handleChange={handleChange}
              />
            ) : (
              <TruckerRegistration
                formData={formData}
                handleChange={handleChange}
              />
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
