"use client";

import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2, Check } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

interface ColumnToggleProps<TData> {
  table: Table<TData>;
}

export function ColumnToggle<TData>({ table }: ColumnToggleProps<TData>) {
  const { t } = useTranslation();
  const hiddenColumnIds = ["id", "description"];

  const hiddenColumns = table
    .getAllColumns()
    .filter((column) => typeof column.accessorFn !== "undefined" && hiddenColumnIds.includes(column.id));

  const displayName = (columnId: string) => {
    const names: Record<string, string> = {
      id: t.admin.credits.table.columns.id,
      user: t.admin.credits.table.columns.user,
      type: t.admin.credits.table.columns.type,
      amount: t.admin.credits.table.columns.amount,
      balance: t.admin.credits.table.columns.balance,
      description: t.admin.credits.table.columns.description,
      createdAt: t.admin.credits.table.columns.createdAt,
    };
    return names[columnId] || columnId;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8">
          <Settings2 className="mr-2 h-4 w-4" />
          {t.admin.users.table.search.toggleColumns}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>{t.admin.users.table.search.toggleColumns}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hiddenColumns.map((column) => (
          <DropdownMenuItem
            key={column.id}
            className="flex items-center justify-between"
            onSelect={(e) => {
              e.preventDefault();
              column.toggleVisibility();
            }}
          >
            <span className="capitalize">{displayName(column.id)}</span>
            {column.getIsVisible() && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
