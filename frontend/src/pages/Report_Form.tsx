import { useEffect, useState, useRef } from "react";
import ComponentCard from "../components/common/ComponentCard";
import PageMeta from "../components/common/PageMeta";
import axiosInstance from "../api/axios";

const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sheetUrl, setSheetUrl] = useState<string>("");

  const hasFetched = useRef(false); // 👈 guard to prevent double calls

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchReport = async () => {
      try {
        const response = await axiosInstance.post(`/payment/user-status`);
        if (response.data.success) {
          setMessage(`✅ Report updated: ${response.data.message}`);
          setSheetUrl(response.data.sheetUrl);
        } else {
          setMessage(`⚠️ ${response.data.message || "Unknown response."}`);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("❌ Failed to generate report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <>
      <PageMeta title="Report Form" description="Generate and view reports" />
      <ComponentCard title="Wow Monthly Report">
        <div className="space-y-6 text-center">
          {loading ? (
            <p className="text-gray-600">🔄 Generating and uploading report...</p>
          ) : (
            <>
              <p className="text-gray-800">{message}</p>
              {sheetUrl && (
                <div className="mt-4">
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    📄 Open Google Sheet
                  </a>
                </div>
              )}
            </>
          )}
        </div>
      </ComponentCard>
    </>
  );
};

export default MyComponent;
