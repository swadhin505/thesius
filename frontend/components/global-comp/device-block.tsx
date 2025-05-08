"use client";

import { useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface DeviceBlockerProps {
  children: ReactNode;
}

const DeviceBlocker: React.FC<DeviceBlockerProps> = ({ children }) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const isMobileOrTablet = (): boolean => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|android|mobile/i.test(userAgent);
      const isTablet = /tablet/i.test(userAgent);
      const isSmallScreen = window.innerWidth < 1000; // Adjust breakpoint as needed
      return isMobile || isTablet || isSmallScreen;
    };

    if (isMobileOrTablet()) {
      setShowModal(true);
    }
  }, []);

  const handleRedirect = () => {
    setShowModal(false);
    router.push("/"); // Redirect to a custom unsupported page
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded shadow-md text-center max-w-sm">
          <h2 className="text-xl font-bold mb-4">Screen Size Not Supported</h2>
          <p className="mb-6">
            This page is currently not optimized for smaller screens. Please access it from a laptop or desktop in full page mode.
          </p>
          <button
            onClick={handleRedirect}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DeviceBlocker;
