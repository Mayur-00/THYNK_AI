import { Loader2 } from 'lucide-react'
import React from 'react'

const PageLoaderComponent = () => {
  return (
    <div className='h-screen w-screen bg-white flex justify-center items-center'>
        <Loader2 className='animate-spin' size={50}/>
    </div>
  )
}

export default PageLoaderComponent