import { headers } from "next/headers";
import { config } from "@config";
import { translations } from "@libs/i18n";
import { DataTable } from "./table";
import { AdjustForm } from "./adjust-form";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CreditsPage({ params, searchParams }: PageProps) {
  const [{ lang }, rawParams] = await Promise.all([params, searchParams]);
  const t = translations[lang as keyof typeof translations];

  const page = Number(rawParams.page) || 1;
  const pageSize = 10;
  const searchValue = (rawParams.searchValue as string) || "";
  const searchField = (rawParams.searchField as string) || "userEmail";
  const type = (rawParams.type as string) || "all";
  const sortBy = (rawParams.sortBy as string) || undefined;
  const sortDirection = (rawParams.sortDirection as "asc" | "desc") || undefined;

  const queryParams = new URLSearchParams({
    limit: pageSize.toString(),
    offset: ((page - 1) * pageSize).toString(),
  });

  if (searchValue) {
    queryParams.append("searchField", searchField);
    queryParams.append("searchValue", searchValue);
  }

  if (type && type !== "all") {
    queryParams.append("type", type);
  }

  if (sortBy && sortDirection) {
    queryParams.append("sortBy", sortBy);
    queryParams.append("sortDirection", sortDirection);
  }

  const baseUrl = config.app.baseUrl;
  const apiUrl = `${baseUrl}/api/admin/credits?${queryParams.toString()}`;

  try {
    const response = await fetch(apiUrl, {
      headers: await headers(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch credit transactions");
    }

    const data = await response.json();
    const totalPages = Math.ceil((data?.total || 0) / pageSize);

    return (
      <div className="container mx-auto py-10 px-5 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t.admin.credits.title}</h1>
            <p className="text-muted-foreground text-sm">{t.admin.credits.subtitle}</p>
          </div>
        </div>

        <AdjustForm />

        <DataTable
          data={data?.transactions || []}
          pagination={{
            currentPage: page,
            totalPages,
            pageSize,
            total: data?.total || 0,
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching credits:", error);
    return (
      <div className="container mx-auto py-10 px-5">
        <h1 className="text-2xl font-bold">{t.admin.credits.title}</h1>
        <p className="text-red-500 mt-4">{t.admin.credits.messages.fetchError}</p>
      </div>
    );
  }
}
