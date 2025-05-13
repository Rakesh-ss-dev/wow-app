import axios from "axios";
import { useEffect, useState } from "react";

// Define the shape of an installment object
interface Installment {
  id: string;
  amount: number;
  dueAmount:number;
  dueDate: string;
  status: string;
}

const PendingInstallment = () => {
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const SERVER_URL = import.meta.env.VITE_SERVER_URL as string;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/payment/get-installments`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setInstallments(response.data?.installments || []);
      } catch (err: any) {
        console.error("Error fetching installments:", err);
        setError("Failed to fetch installments.");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [SERVER_URL, token]);

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Pending Installments</h2>
      {installments.length === 0 ? (
        <p className="text-gray-500">No pending installments.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full  shadow-md rounded-lg overflow-hidden">
            <thead className="bg-brand-500 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">#</th>
                <th className="px-6 py-3 text-left text-white text-sm font-medium">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-white text-sm font-medium">
                  Due Amount
                </th>
                <th className="px-6 py-3 text-left text-white text-sm font-medium">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-white text-sm font-medium">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {installments.map((item, index) => {
                console.log(item);
                return (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.amount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.dueAmount}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.dueDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.status}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingInstallment;
