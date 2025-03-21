import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
export default function Blank() {
  return (
    <div>
      <PageMeta title="WOW dashboard" description="Wow Dashboard" />
      <PageBreadcrumb pageTitle="Dashboard" />
      <div className="bg-white border border-gray-200 rounded-2xl dark:bg-white/[0.03] dark:border-gray-800 min-h-screen px-5 py-7 xl:px-10 xl:py-12">
        <div className="text-center w-full max-w-[630px] mx-auto">
        </div>
      </div>
    </div>
  );
}
