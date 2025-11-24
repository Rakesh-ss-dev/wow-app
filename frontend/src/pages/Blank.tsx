import { useState } from "react";
import OldUsers from "../components/UserProfile/OldUsers";
import PendingUsers from "../components/UserProfile/PaidUsers";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
export default function Blank() {
  const [paidUsers, setPaidUsers] = useState(true);
  const [oldUsers, setOldUsers] = useState(false);
  return (
    <div>
      <PageMeta title="Dashboard" description="View and manage user categories" />
      <ComponentCard title="Dashboard">
        <div className="grid grid-cols-2 items-center gap-x-1 gap-y-2 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
          <button
            onClick={() => {
              setPaidUsers(true);
              setOldUsers(false);
            }}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white ${paidUsers
              ? "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              : "text-gray-500 dark:text-gray-400"
              }`}
          >
            Paid Users
          </button>
          <button
            onClick={() => {
              setPaidUsers(false);
              setOldUsers(true);
            }}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md group hover:text-gray-900 dark:hover:text-white ${oldUsers
              ? "text-gray-900 dark:text-white bg-white dark:bg-gray-800"
              : "text-gray-500 dark:text-gray-400"
              }`}
          >
            Old Users
          </button>
        </div>
        {paidUsers && <PendingUsers />}
        {oldUsers && <OldUsers />}
      </ComponentCard>
    </div>
  );
}
