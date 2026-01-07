"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import type { Translations } from "@libs/i18n"

interface FeedbackTableProps {
  data: {
    id: string
    email: string
    content: string
    status: string
    createdAt: string
  }[]
  pagination: {
    currentPage: number
    totalPages: number
    pageSize: number
    total: number
  }
  t: Translations
}

export function FeedbackTable({ data, pagination, t }: FeedbackTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.adminFeedback.table.email}</TableHead>
              <TableHead>{t.adminFeedback.table.content}</TableHead>
              <TableHead className="w-[140px]">{t.adminFeedback.table.createdAt}</TableHead>
              <TableHead className="w-[100px]">{t.adminFeedback.table.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                  {t.common.notAvailable}
                </TableCell>
              </TableRow>
            )}
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.email}</TableCell>
                <TableCell className="max-w-[480px] text-sm text-muted-foreground">
                  <span className="line-clamp-3">{item.content}</span>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {item.status || "new"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
        <span>
          {pagination.total} {t.adminFeedback.title}
        </span>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.currentPage > 1) goToPage(pagination.currentPage - 1)
                }}
                className={pagination.currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                {pagination.currentPage}/{pagination.totalPages}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (pagination.currentPage < pagination.totalPages) goToPage(pagination.currentPage + 1)
                }}
                className={pagination.currentPage === pagination.totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}
