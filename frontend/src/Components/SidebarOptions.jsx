import React from 'react'

const SidebarOptions = (props) => {
  return (
    <div className={`mb-3 w-full ${props.border ? 'border border-[#F4F5F6]' : ''} ${props.active?'text-[#3772FF]':''} p-2 justify-between items-center flex rounded-[8px] gap-2`}>
            <div className='flex gap-2 items-center justify-center'>
            <img src={props.frontIcon} alt="" />
            <p>{props.title}</p>
            </div>
            {
              props.backIcon.length==0?'':<div><img src={props.backIcon} alt="" /></div>
            }
          </div>
  )
}

export default SidebarOptions