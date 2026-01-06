"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, X } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

type SearchField = "userEmail" | "userId" | "id";
type TransactionType = "purchase" | "bonus" | "consumption" | "refund" | "adjustment" | "all";

export function Search() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams?.get("searchValue") || "");
  const [searchField, setSearchField] = useState<SearchField>((searchParams?.get("searchField") as SearchField) || "userEmail");
  const [type, setType] = useState<TransactionType>((searchParams?.get("type") as TransactionType) || "all");

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      Object.entries(params).forEach(([key, value]) => {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const onSearch = () => {
    router.push(
      `${pathname}?${createQueryString({
        searchValue: searchValue || null,
        searchField,
        type: type === "all" ? null : type,
        page: "1",
      })}`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  const handleClear = () => {
    setSearchValue("");
    setSearchField("userEmail");
    setType("all");
    router.push(
      `${pathname}?${createQueryString({
        searchValue: null,
        searchField: null,
        type: null,
        page: "1",
      })}`
    );
  };

  const getSearchPlaceholder = () => {
    return t.admin.credits.filters.searchPlaceholder;
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-1">
      <Select value={searchField} onValueChange={(value: SearchField) => setSearchField(value)}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Field" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="userEmail">Email</SelectItem>
          <SelectItem value="userId">User ID</SelectItem>
          <SelectItem value="id">Transaction ID</SelectItem>
        </SelectContent>
      </Select>

      <Input
        placeholder={getSearchPlaceholder()}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-[250px]"
      />

      <Button type="submit" size="icon" className="shrink-0">
        <SearchIcon className="h-4 w-4" />
      </Button>

      <Button type="button" variant="outline" size="icon" className="shrink-0" onClick={handleClear}>
        <X className="h-4 w-4" />
      </Button>

      <div className="mx-2 h-4 w-[1px] bg-border" />

      <Select
        value={type}
        onValueChange={(value: TransactionType) => {
          setType(value);
          router.push(
            `${pathname}?${createQueryString({
              type: value === "all" ? null : value,
              page: "1",
            })}`
          );
        }}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={t.admin.credits.filters.type} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t.admin.credits.filters.allTypes}</SelectItem>
          <SelectItem value="purchase">purchase</SelectItem>
          <SelectItem value="bonus">bonus</SelectItem>
          <SelectItem value="consumption">consumption</SelectItem>
          <SelectItem value="refund">refund</SelectItem>
          <SelectItem value="adjustment">adjustment</SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
}
