import { DashboardComponent } from '@/components/dashboard-comp/dashboard'
import ProtectedRoute from '@/components/global-comp/protected-route'
import { ExpandableSidebar } from '@/components/tool-comp/common-comp/expandable-sidebar'
import React from 'react'

const Dashboard = async () => {
  return (
    <ProtectedRoute route={true}>
      <div className='min-h-[100vh] h-fit bg-gray-100 flex justify-between'>
          <div className='flex-grow'>
            <ExpandableSidebar /> 
          </div>
          <div className='w-[90vw]'>
            <DashboardComponent/>
          </div>
      </div>
    </ProtectedRoute>
  )
}

export default Dashboard