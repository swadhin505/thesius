import { SinglePaperChatStateProvider } from '@/context/viewerContext';
import MainViewer from "@/components/tool-comp/paper-chat-comp/mainViewer"
import ProtectedRoute from '@/components/global-comp/protected-route';
import DeviceBlocker from '@/components/global-comp/device-block';

export default function Page() {
  return (
    // <DeviceBlocker>
      <ProtectedRoute route={true}>
        <SinglePaperChatStateProvider>
          <div className='bg-gray-200'>
            <MainViewer />  
          </div>
        </SinglePaperChatStateProvider>
      </ProtectedRoute>
    // </DeviceBlocker>
  )

}