"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "@/hooks/use-translation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Search } from "./components/search";
import { ColumnToggle } from "./components/column-toggle";

interface Transaction {
  id: string;
  userId: string;
  userEmail?: string | null;
  userName?: string | null;
  type: string;
  amount: string;
  balance: string;
  description: string | null;
  createdAt: string;
}

interface DataTableProps {
  data: Transaction[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    total: number;
  };
}

export function DataTable({ data, pagination }: DataTableProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const columns = useMemo<ColumnDef<Transaction>[]>(
    () => [
      {
        accessorKey: "id",
        header: t.admin.credits.table.columns.id,
        cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
      },
      {
        accessorKey: "user",
        header: t.admin.credits.table.columns.user,
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="font-medium text-sm">{row.original.userName || "-"}</div>
            <div className="text-xs text-muted-foreground">{row.original.userEmail || row.original.userId}</div>
          </div>
        ),
      },
      {
        accessorKey: "type",
        header: t.admin.credits.table.columns.type,
        cell: ({ row }) => <Badge variant="secondary">{row.original.type}</Badge>,
      },
      {
        accessorKey: "amount",
        header: t.admin.credits.table.columns.amount,
        cell: ({ row }) => {
          const value = Number(row.original.amount);
          const formatted = Number.isNaN(value) ? row.original.amount : value.toFixed(2);
          return <span className={value < 0 ? "text-red-500" : "text-green-600"}>{formatted}</span>;
        },
      },
      {
        accessorKey: "balance",
        header: t.admin.credits.table.columns.balance,
        cell: ({ row }) => {
          const value = Number(row.original.balance);
          const formatted = Number.isNaN(value) ? row.original.balance : value.toFixed(2);
          return <span>{formatted}</span>;
        },
      },
      {
        accessorKey: "description",
        header: t.admin.credits.table.columns.description,
        cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.description || "-"}</span>,
      },
      {
        accessorKey: "createdAt",
        header: t.admin.credits.table.columns.createdAt,
        cell: ({ row }) => {
          const date = new Date(row.original.createdAt);
          const formatted = Number.isNaN(date.getTime())
            ? row.original.createdAt
            : date.toISOString().replace('T', ' ').slice(0, 16); // Stable UTC format to avoid hydration mismatch
          return <span className="text-sm text-muted-foreground">{formatted}</span>;
        },
      },
    ],
    [t]
  );

  const COLUMN_VISIBILITY_KEY = "admin-credits-column-visibility";
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    id: false,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(COLUMN_VISIBILITY_KEY) : null;
    if (saved) {
      try {
        setColumnVisibility(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved column visibility:", e);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(COLUMN_VISIBILITY_KEY, JSON.stringify(columnVisibility));
    }
  }, [columnVisibility]);

  useEffect(() => {
    const sortBy = searchParams.get("sortBy");
    const sortDirection = searchParams.get("sortDirection");
    if (sortBy && sortDirection) {
      setSorting([{ id: sortBy, desc: sortDirection === "desc" }]);
    }
  }, [searchParams]);

  const table = useReactTable({
    data,
    columns,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: (updater) => {
      const newSorting = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(newSorting);

      const newParams = new URLSearchParams(searchParams?.toString());
      if (newSorting.length > 0) {
        newParams.set("sortBy", newSorting[0].id);
        newParams.set("sortDirection", newSorting[0].desc ? "desc" : "asc");
      } else {
        newParams.delete("sortBy");
        newParams.delete("sortDirection");
      }
      newParams.set("page", "1");
      router.push(`${pathname}?${newParams.toString()}`);
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    getSortedRowModel: getSortedRowModel(),
    state: {
      columnVisibility,
      sorting,
    },
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Search />
        <ColumnToggle table={table} />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t.admin.credits.table.noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                className={pagination.currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                label={t.actions.previous}
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }).map((_, index) => {
              const page = index + 1;
              if (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= pagination.currentPage - 2 && page <= pagination.currentPage + 2)
              ) {
                return (
                  <PaginationItem key={page}>
                    <PaginationLink isActive={page === pagination.currentPage} onClick={() => handlePageChange(page)}>
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              }
              if (page === pagination.currentPage - 3 || page === pagination.currentPage + 3) {
                return (
                  <PaginationItem key={page}>
                    <span className="flex h-9 w-9 items-center justify-center">...</span>
                  </PaginationItem>
                );
              }
              return null;
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                className={pagination.currentPage >= pagination.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                label={t.actions.next}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
