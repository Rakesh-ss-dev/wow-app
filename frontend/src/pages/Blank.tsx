import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ActiveUsers from "../components/UserProfile/ActiveUsers";
import OldUsers from "../components/UserProfile/OldUsers";
import PendingUsers from "../components/UserProfile/PendingUsers";
export default function Blank() {
  return (
    <div>
      <PageMeta title="WOW dashboard" description="Wow Dashboard" />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="bg-white border border-gray-200 rounded-2xl dark:bg-white/[0.03] dark:border-gray-800 min-h-screen">
        <div className="grid lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-3 gap-5">
          <ActiveUsers />
          <PendingUsers />
          <OldUsers />
        </div>
      </div>
    </div>
  );
}
