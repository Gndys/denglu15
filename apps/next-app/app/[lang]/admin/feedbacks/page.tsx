import { headers } from "next/headers";
import { translations } from "@libs/i18n";
import { config } from "@config";
import { FeedbackTable } from "./table";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function FeedbacksPage({ params, searchParams }: PageProps) {
  const [{ lang }, rawParams] = await Promise.all([params, searchParams]);
  const t = translations[lang as keyof typeof translations];

  const page = Number(rawParams.page) || 1;
  const pageSize = 20;
  const query = new URLSearchParams({
    limit: pageSize.toString(),
    offset: ((page - 1) * pageSize).toString(),
  });

  try {
    const apiUrl = `${config.app.baseUrl}/api/admin/feedbacks?${query.toString()}`;
    const response = await fetch(apiUrl, {
      headers: await headers(),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch feedbacks");
    }

    const data = await response.json();
    const totalPages = Math.max(1, Math.ceil((data?.total || 0) / pageSize));

    return (
      <div className="container mx-auto py-10 px-5 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t.adminFeedback.title}</h1>
        </div>
        <FeedbackTable
          data={data?.feedbacks || []}
          pagination={{
            currentPage: page,
            totalPages,
            pageSize,
            total: data?.total || 0,
          }}
          t={t}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return (
      <div className="container mx-auto py-10 px-5">
        <h1 className="text-2xl font-bold">{t.adminFeedback.title}</h1>
        <p className="text-red-500 mt-4">{t.adminFeedback.messages.fetchError}</p>
      </div>
    );
  }
}
