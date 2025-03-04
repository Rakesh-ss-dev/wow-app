import React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  CellContext,
  SortingState,
} from "@tanstack/react-table";

type Request = {
  name: string;
  phone: string;
  package: {
    name: string;
  };
  status: string;
  amount:string;
  createdAt: string;
  createdBy?: {
    name: string;
  };
};

interface RequestDataTableProps {
  data: Request[];
}
const formatReadableDate = (isoString: string): string => {
  if (!isoString) return "Invalid Date"; // Prevent errors for empty values

  const date = new Date(isoString);
  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Keep 24-hour format
  });
};

const RequestDataTable: React.FC<RequestDataTableProps> = ({ data }) => {
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const columns = [
    {
      accessorKey: "name",
      header: "Client",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "package.name",
      header: "Package",
    },
    {
      accessorKey:"amount",
      header:"Amount",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: (info: CellContext<Request, string | undefined>) =>
        formatReadableDate(info.getValue()||''),
    },
    ...(parsedUser?.isSuperUser
      ? [
          {
            accessorKey: "createdBy.name",
            header: "Created By",
            cell: (info: CellContext<Request, string | undefined>) =>
              info.getValue() || "N/A",
          },
        ]
      : []),
  ];
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4">
      <table className="w-full bg-white shadow-md rounded-lg">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="bg-brand-500 text-gray-200 uppercase text-sm"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="py-3 px-6 text-left cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {header.column.getIsSorted()
                    ? header.column.getIsSorted() === "desc"
                      ? " 🔽"
                      : " 🔼"
                    : ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="py-3 px-6 text-left">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="px-4 py-2 bg-brand-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {table.getState().pagination.pageIndex + 1}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="px-4 py-2 bg-brand-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RequestDataTable;
