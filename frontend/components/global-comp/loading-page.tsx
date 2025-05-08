import { Loader2 } from 'lucide-react'
import Spinner from '@/assets/Common/Spinner.svg'
import Image from 'next/image'

export default function LoadingPage() {
  return (
    <div className="z-[200] fixed top-0 w-screen h-screen flex items-center justify-center bg-white/50 backdrop-blur-xl">
        {/* <Loader2 className="w-12 h-12 text-white animate-spin" /> */}
        <Image className='w-16 h-16' src={Spinner} alt='Loading...' />
    </div>
  )
}