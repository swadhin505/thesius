"use client";

import { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingPage from "./loading-page";
import { useAuth, User } from "@/context/AuthContext";
import { BACKEND_URL } from "@/lib/constants";

interface ProtectedRouteProps {
  children: ReactNode;
  route: boolean; // New prop
}

interface ProtectedAuthResponse {
  userData: User;
  message: string;
}

const ProtectedRoute = ({ children, route = true }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const router = useRouter();

  const { user, setUser } = useAuth();

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const response = await axios.get<ProtectedAuthResponse>(`${BACKEND_URL}/auth/protected`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setAuthorized(true);
          setUser(response.data.userData);
        }
      } catch (error) {
        console.error("Not authorized:", error);
        setAuthorized(false);

        // Use the `route` condition here
        if (route) {
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthorization();
  }, [router, route]);

  if (loading) return <div><LoadingPage /></div>;

  if (!authorized && route) return null; // Optionally, show a "Not authorized" message here.

  return <>{children}</>;
};

export default ProtectedRoute;
