import React from "react";
import dashboardIcon from "../assets/dashboard.svg";
import boardsIcon from "../assets/boards.svg";
import messageIcon from "../assets/messageIcon.svg";
import calenderIcon from "../assets/calender.svg";
import infoIcon from '../assets/info.svg'
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-24 border-r border-gray-300 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to={{pathname:'/dashboard'}}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src={dashboardIcon} alt="Dashboard Icon" />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
            <Link
                to={{pathname:'/payment-requests'}}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src={infoIcon} alt="Dashboard Icon" />
                <span className="ms-3">Requests</span>
              </Link>
            </li>
            <li>
            <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                  <img src={boardsIcon} alt="Borads Icon" />
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Boards</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>
            <ul id="dropdown-example" className="hidden py-2 space-y-2">
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Reports</a>
                  </li>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Supplements</a>
                  </li>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Health Issues</a>
                  </li>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Duration</a>
                  </li>
            </ul>
         </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src={messageIcon} alt="Message Icon" />
                <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
                  3
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img src={calenderIcon} alt="Calender Icon" />
                <span className="flex-1 ms-3 whitespace-nowrap">Calendar</span>
              </a>
            </li>
            
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/exit.png" alt="exit"/>
                <span className="flex-1 ms-3 whitespace-nowrap">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
