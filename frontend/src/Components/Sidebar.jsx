import React from 'react'
import clientLogo from '../assets/clients.svg'
import arrowDown from '../assets/arrow-down.svg'
import dashboardIcon from '../assets/dashboard.svg'
import boardsIcon from '../assets/boards.svg'
import arrowUp from '../assets/arrowUp.svg'
import SidebarOptions from './SidebarOptions'
const Sidebar = () => {
  return (
    <div className='sidebar fixed h-100 bg-white top-22 p-5'>
      <SidebarOptions border={true} active={false} frontIcon={clientLogo} title="Clients" backIcon={arrowDown} />
      <SidebarOptions border={false} active={false} frontIcon={dashboardIcon} title="Dashboard" backIcon=''/>
      <SidebarOptions border={true} active={true} frontIcon={boardsIcon} title="Boards" backIcon={arrowUp}/>
      
    </div>
  )
}

export default Sidebar