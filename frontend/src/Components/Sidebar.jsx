import React from 'react'
import clientLogo from '../assets/clients.svg'
import arrowDown from '../assets/arrow-down.svg'
const Sidebar = () => {
  return (
    <div className='sidebar fixed h-100 bg-white top-22 p-5'>
      <div className='w-full border border-[#F4F5F6] p-2 justify-between items-center flex rounded-[8px] gap-2'>
        <div className='flex gap-2 items-center justify-center'>
        <img src={clientLogo} alt="" />
        <p>Clients</p>
        </div>
        <div>
          <img src={arrowDown} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Sidebar