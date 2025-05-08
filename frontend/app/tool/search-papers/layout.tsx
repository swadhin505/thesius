import DeviceBlocker from "@/components/global-comp/device-block";
import { SearchPaperProvider } from "@/context/SearchPapersContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  // <DeviceBlocker>
    <div>
      <main className="h-[100vh]">
        <SearchPaperProvider>
          {children}
        </SearchPaperProvider>
      </main>
    </div>
  // {/* </DeviceBlocker> */}
);

export default Layout;
