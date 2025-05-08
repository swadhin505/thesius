import DeviceBlocker from "@/components/global-comp/device-block";
import ProtectedRoute from "@/components/global-comp/protected-route";
import { SearchPaperProvider } from "@/context/SearchPapersContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  // <DeviceBlocker>
    <div>
      <ProtectedRoute route={true}>
        <SearchPaperProvider>
          <main className="h-[100vh]">
            {children}
          </main>
        </SearchPaperProvider>
      </ProtectedRoute>
    </div>
  // {/* </DeviceBlocker> */}
);

export default Layout;
