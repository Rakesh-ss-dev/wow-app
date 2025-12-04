import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table";
import React from "react";
import { Link } from "react-router";

const NutritionistDatatable = ({ nutritionists }: { nutritionists: any[] }) => {
    const [sorting, setSorting] = React.useState<SortingState>([
        { id: "name", desc: false },
    ]);
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <Link className="font-medium" to={`/nutritionist/${row.original?._id}/clients`}>{row.original.name}</Link>
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phone",
            header: "Phone",
        },
        {
            accessorKey: "assignedTo",
            header: "Assigned To",
            cell: ({ row }) => row.original.assignedTo ? row.original.assignedTo.name : 'N/A'
        }
    ];

    const table = useReactTable({
        data: nutritionists,
        columns,
        state: { sorting },
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
                        <tr key={headerGroup.id} className="bg-brand-500 text-gray-200 uppercase text-sm">
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="py-3 px-6 text-left cursor-pointer"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    <span className="ml-2">
                                        {header.column.getIsSorted() === "asc" && "🔼"}
                                        {header.column.getIsSorted() === "desc" && "🔽"}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100">
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
                <span className="text-gray-700">Page {table.getState().pagination.pageIndex + 1}</span>
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
}

export default NutritionistDatatable