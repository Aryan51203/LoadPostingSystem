'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ShipperDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from API or localStorage
    const fetchUser = async () => {
      try {
        // This would be replaced with an actual API call
        // const response = await fetch('http://localhost:5000/api/auth/me', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`,
        //   },
        // });
        // const data = await response.json();
        // setUser(data.data);

        // Mock user data for now
        setUser({
          name: 'John Doe',
          email: 'john@example.com',
          role: 'shipper',
          companyName: 'ABC Shipping Co.',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard/shipper', current: pathname === '/dashboard/shipper' },
    { name: 'My Loads', href: '/dashboard/shipper/loads', current: pathname === '/dashboard/shipper/loads' },
    { name: 'Post Load', href: '/dashboard/shipper/loads/create', current: pathname === '/dashboard/shipper/loads/create' },
    { name: 'Bids', href: '/dashboard/shipper/bids', current: pathname === '/dashboard/shipper/bids' },
    { name: 'Tracking', href: '/dashboard/shipper/tracking', current: pathname === '/dashboard/shipper/tracking' },
    { name: 'Payments', href: '/dashboard/shipper/payments', current: pathname === '/dashboard/shipper/payments' },
    { name: 'Reports', href: '/dashboard/shipper/reports', current: pathname === '/dashboard/shipper/reports' },
  ];

  const userNavigation = [
    { name: 'Your Profile', href: '/dashboard/shipper/profile' },
    { name: 'Settings', href: '/dashboard/shipper/settings' },
    { name: 'Sign out', href: '/auth/logout' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 pb-32">
        <nav className="bg-blue-600 border-b border-blue-500 border-opacity-25 lg:border-none">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
            <div className="relative h-16 flex items-center justify-between lg:border-b lg:border-blue-500 lg:border-opacity-25">
              <div className="px-2 flex items-center lg:px-0">
                <div className="flex-shrink-0">
                  <Link href="/dashboard/shipper" className="text-white font-bold text-xl">
                    LoadPostingSystem
                  </Link>
                </div>
                <div className="hidden lg:block lg:ml-10">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`${
                          item.current
                            ? 'bg-blue-700 text-white'
                            : 'text-white hover:bg-blue-500 hover:bg-opacity-75'
                        } rounded-md py-2 px-3 text-sm font-medium`}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex lg:hidden">
                <button
                  type="button"
                  className="bg-blue-600 p-2 rounded-md inline-flex items-center justify-center text-blue-200 hover:text-white hover:bg-blue-500 hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
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
                </button>
              </div>
              <div className="hidden lg:block lg:ml-4">
                <div className="flex items-center">
                  <button className="bg-blue-600 flex-shrink-0 rounded-full p-1 text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <svg
                      className="h-6 w-6"
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>

                  <div className="ml-3 relative flex-shrink-0">
                    <div>
                      <button
                        type="button"
                        className="bg-blue-600 rounded-full flex text-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white"
                        id="user-menu-button"
                      >
                        <span className="sr-only">Open user menu</span>
                        <div className="h-8 w-8 rounded-full bg-blue-700 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
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
                        ? 'bg-blue-700 text-white'
                        : 'text-white hover:bg-blue-500 hover:bg-opacity-75'
                    } block rounded-md py-2 px-3 text-base font-medium`}
                    aria-current={item.current ? 'page' : undefined}
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
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user?.name}</div>
                    <div className="text-sm font-medium text-blue-300">{user?.email}</div>
                  </div>
                  <button className="ml-auto bg-blue-600 flex-shrink-0 rounded-full p-1 text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-600 focus:ring-white">
                    <span className="sr-only">View notifications</span>
                    <svg
                      className="h-6 w-6"
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
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </button>
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
            <h1 className="text-3xl font-bold text-white">Shipper Dashboard</h1>
          </div>
        </header>
      </div>

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