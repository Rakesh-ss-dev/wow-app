import React from 'react'
import clientLogo from '../assets/clients.svg'
import arrowDown from '../assets/arrow-down.svg'
import dashboardIcon from '../assets/dashboard.svg'
import boardsIcon from '../assets/boards.svg'
import arrowUp from '../assets/arrowUp.svg'
import messageIcon from '../assets/messageIcon.svg'
import calenderIcon from '../assets/calender.svg'
import SidebarOptions from './SidebarOptions'
import SubMenuItem from './SubMenuItem'
const Sidebar = () => {
  return (
    <div className='sidebar fixed bg-white top-22 p-5 overflow-scroll'>
      <SidebarOptions border={true} active={false} frontIcon={clientLogo} title="Clients" backIcon={arrowDown} />
      <SidebarOptions border={false} active={false} frontIcon={dashboardIcon} title="Dashboard" backIcon=''/>
      
      <SidebarOptions border={true} active={true} frontIcon={boardsIcon} title="Boards" backIcon={arrowUp}/>
      <div>
          <div className='border border-[#F4F5F6] rounded-[8px] p-3'>
            <SubMenuItem title="Reports"/>
            <SubMenuItem title="Supplements"/>
            <SubMenuItem active={true} title="Health Issues"/>
            <SubMenuItem title="Duration"/>
          </div>
      </div>
      <SidebarOptions border={false} active={false} frontIcon={messageIcon} title="Messages" backIcon={arrowDown}/>
      <SidebarOptions border={false} active={false} frontIcon={calenderIcon} title="Calender" backIcon=''/>
      <SidebarOptions border={false} active={false} frontIcon={calenderIcon} title="Calender" backIcon=''/>

    </div>
    
  )
}

export default Sidebar