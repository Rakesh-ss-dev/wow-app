import React from "react";
import wowlogo from "../assets/WOW_Badge.svg";
import userIcon from '../assets/User_Icon.svg'
import notificationIcon from '../assets/Notification_Bell.svg'
const Topbar = () => {
  return (
    <div className="border-[#243c5a] border-1 container mx-auto px-12 py-4 bg-white">
      <div className="flex justify-between">
        <div>
          <img src={wowlogo} alt="WOW Logo" />
        </div>
        <div class="flex gap-10">
          <form class="max-w-md mx-auto">
            <label
              for="default-search"
              class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
            >
              Search
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  class="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-[#F4F5F6] focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search"
                required
              />
            </div>
          </form>
          <div className="flex items-center justify-center">
            <div className="text-[#373737] font-bold pr-2.5">Mr. KANTHA REDDY</div>
            <img className="pr-2.5" src={userIcon} width={30} alt="User Icon" />
            <img src={notificationIcon} alt="Notification Icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
