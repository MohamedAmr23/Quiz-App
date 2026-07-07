import React from 'react'

export default function Title({title}: {title?: string}) {
  return (
    <div className='flex items-center  gap-4 '>
       <h2 className=' text-2xl font-bold text-[#3D3128]'>{title}</h2> 
        </div>
  )
}
