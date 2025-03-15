"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axiosInstance from "@/lib/utils/axiosInstance";
import { toast } from "react-toastify";

export default function TruckerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/api/auth/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard/trucker",
      current: pathname === "/dashboard/trucker",
    },
    {
      name: "My Loads",
      href: "/dashboard/trucker/loads",
      current: pathname === "/dashboard/trucker/loads",
    },
    {
      name: "Available Loads",
      href: "/dashboard/trucker/loads/available",
      current: pathname === "/dashboard/trucker/loads/available",
    },
    {
      name: "My Bids",
      href: "/dashboard/trucker/bids",
      current: pathname === "/dashboard/trucker/bids",
    },
    {
      name: "Earnings",
      href: "/dashboard/trucker/earnings",
      current: pathname === "/dashboard/trucker/earnings",
    },
    {
      name: "Documents",
      href: "/dashboard/trucker/documents",
      current: pathname === "/dashboard/trucker/documents",
    },
    {
      name: "Performance",
      href: "/dashboard/trucker/performance",
      current: pathname === "/dashboard/trucker/performance",
    },
  ];

  const userNavigation = [
    { name: "Your Profile", href: "/dashboard/trucker/profile" },
    { name: "Settings", href: "/dashboard/trucker/settings" },
    { name: "Sign out", href: "/auth/logout" },
  ];

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Link
                  href="/dashboard/trucker"
                  className="text-white font-bold text-xl"
                >
                  TruckingPro
                </Link>
              </div>
              <div className="hidden lg:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        item.current
                          ? "bg-blue-700 text-white"
                          : "text-white hover:bg-blue-500 hover:bg-opacity-75"
                      } px-3 py-2 rounded-md text-sm font-medium`}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="ml-3 relative">
                  <div>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="max-w-xs bg-blue-600 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                    </button>
                  </div>
                  {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="-mr-2 flex lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? "bg-blue-700 text-white"
                      : "text-white hover:bg-blue-500 hover:bg-opacity-75"
                  } block rounded-md py-2 px-3 text-base font-medium`}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-blue-700">
              <div className="px-5 flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-white">
                    {user?.name}
                  </div>
                  <div className="text-sm font-medium text-blue-300">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 px-2 space-y-1">
                {userNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block rounded-md py-2 px-3 text-base font-medium text-white hover:bg-blue-500 hover:bg-opacity-75"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
      <header className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Trucker Dashboard</h1>
        </div>
      </header>

      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
