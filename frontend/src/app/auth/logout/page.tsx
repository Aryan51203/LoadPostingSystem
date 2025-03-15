"use client";

import axiosInstance from "@/lib/utils/axiosInstance";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

function LogoutPage() {
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    await axiosInstance.get("/api/auth/logout");
    router.push("/auth/login");
  }, [router]);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);

  return <div>Logging out...</div>;
}

export default LogoutPage;
