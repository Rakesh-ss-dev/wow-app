import { useEffect } from "react";
import { useSearchParams } from "react-router";
import GridShape from "../../components/common/GridShape";
const Payment_successful = () => {
  const [searchParams] = useSearchParams();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const paramsObject = Object.fromEntries(searchParams.entries());
  useEffect(() => {
    const sendDataToBackend = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/payment/success`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paramsObject),
        });

        if (!response.ok) {
          throw new Error("Failed to send data");
        }

        const result = await response.json();
        console.log("Response from backend:", result);
      } catch (error) {
        console.error("Error sending data:", error);
      }
    };
    sendDataToBackend();
  }, [searchParams]);
  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />
        <div className="bg-white  w-2/3 p-4 mb-5 relative">
          <p className="text-center uppercase text-[#04A593] font-bold">
            Payment Successfull!
          </p>
          <div className="flex items-center gap-4">
            <div className="w-2/3">
              <p className="font-bold">Welcome to WoW!</p>
              <p>
                Your transformation starts now! Get ready for a healthier,
                happier you. Our team will reach out soon with the next steps.
              </p>
            </div>
            <div className="w-1/3">
              <img src=".\images\wowshape.svg" alt="" />
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Download Invoice
          </button>
        </div>
        {/* <!-- Footer --> */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - WOW
        </p>
      </div>
    </>
  );
};

export default Payment_successful;
