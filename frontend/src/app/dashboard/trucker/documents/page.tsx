"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/utils/axiosInstance";
import { toast } from "react-toastify";

interface Document {
  _id: string;
  title: string;
  type: string;
  status: "valid" | "expired" | "expiring_soon";
  fileUrl: string;
  expirationDate: string;
  uploadedAt: string;
  verificationStatus: "pending" | "verified" | "rejected";
  rejectionReason?: string;
}

const documentTypes = [
  { id: "cdl", name: "Commercial Driver's License (CDL)" },
  { id: "insurance", name: "Insurance Certificate" },
  { id: "registration", name: "Vehicle Registration" },
  { id: "dot", name: "DOT Number Certificate" },
  { id: "medical", name: "Medical Certificate" },
  { id: "other", name: "Other Documents" },
];

export default function TruckerDocuments() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingType, setUploadingType] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axiosInstance.get("/api/truckers/documents");
      setDocuments(response.data.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Failed to fetch documents. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (type: string, file: File) => {
    setUploadingType(type);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    try {
      await axiosInstance.post("/api/truckers/documents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Document uploaded successfully");
      fetchDocuments();
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setUploadingType(null);
    }
  };

  const getStatusColor = (status: Document["status"]) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "expiring_soon":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationStatusColor = (
    status: Document["verificationStatus"]
  ) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
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
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Documents</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {documentTypes.map((type) => {
          const doc = documents.find((d) => d.type === type.id);
          return (
            <div
              key={type.id}
              className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
            >
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {type.name}
                  </h3>
                  {doc && (
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        doc.status
                      )}`}
                    >
                      {doc.status.replace("_", " ").toUpperCase()}
                    </span>
                  )}
                </div>

                {doc ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">
                        Expires:{" "}
                        {new Date(doc.expirationDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Uploaded:{" "}
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerificationStatusColor(
                          doc.verificationStatus
                        )}`}
                      >
                        {doc.verificationStatus.toUpperCase()}
                      </span>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Document
                      </a>
                    </div>
                    {doc.verificationStatus === "rejected" &&
                      doc.rejectionReason && (
                        <p className="text-sm text-red-600">
                          Reason: {doc.rejectionReason}
                        </p>
                      )}
                  </div>
                ) : (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      No document uploaded
                    </p>
                  </div>
                )}

                <div className="mt-4">
                  <label
                    htmlFor={`file-upload-${type.id}`}
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <input
                            id={`file-upload-${type.id}`}
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(type.id, file);
                              }
                            }}
                            accept=".pdf,.jpg,.jpeg,.png"
                          />
                          <p className="pl-1">
                            {uploadingType === type.id
                              ? "Uploading..."
                              : doc
                              ? "Upload new document"
                              : "Upload document"}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, JPG, or PNG up to 10MB
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
