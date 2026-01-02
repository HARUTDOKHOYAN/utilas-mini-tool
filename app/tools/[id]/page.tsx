import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getTool } from "@/lib/api";
import DescriptionPresentation from "@/Components/DescriptionPresentation";
import KeyFeaturesPresentation from "@/Components/KeyFeaturesPresentation";
import { getServerSession } from "@/lib/auth";
import {ApiError} from "@/lib/api";

type ToolPageProps = {
  params: { id: string };
};

export const dynamic = "force-dynamic";

export default async function ToolDetailPage({
  params,
}: ToolPageProps) {

  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const { id } = await params;

  let tool: Awaited<ReturnType<typeof getTool>> | null = null;

  try {
    tool = await getTool(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }
  console.log(tool);

  if (!tool) {
    notFound();
  }


  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 py-12">
      <header className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900">{tool.title}</h1>

        <div className="overflow-hidden rounded-md border border-zinc-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-zinc-200">
              <tr className="align-top">
                <td className="w-40 bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Tool ID
                </td>
                <td className="px-4 py-3 text-zinc-900">{tool.id}</td>
              </tr>

              <tr className="align-top">
                <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Slug
                </td>
                <td className="px-4 py-3 text-zinc-900">{tool.iframeSlug}</td>
              </tr>

              <tr className="align-top">
                <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Summary
                </td>
                <td className="px-4 py-3 text-zinc-900">
                  {tool.summary || "—"}
                </td>
              </tr>

              <tr className="align-top">
                <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Thumbnail
                </td>
                <td className="px-4 py-3 text-zinc-900">
                  {tool.thumbnail ? (
                    <div className="relative h-28 w-44 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={tool.thumbnail}
                        alt={tool.title}
                        fill
                        sizes="176px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>

              {tool.tags && tool.tags.length > 0 && (
                <tr className="align-top">
                  <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                    Tags
                  </td>
                  <td className="px-4 py-3 text-zinc-900">
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </header>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Key Features</h2>
        {Array.isArray(tool.keyFeatures) && tool.keyFeatures.length > 0 ? (
          <KeyFeaturesPresentation keyFeatures={tool.keyFeatures} />
        ) : (
          <p className="text-sm text-zinc-500 italic">No key features listed.</p>
        )}
      </section>

      <section className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">Description</h2>
        {Array.isArray(tool.description) && tool.description.length > 0 ? (
          <DescriptionPresentation
            description={tool.description}
            toolTitle={tool.title}
          /> 
        ) : (
          <p className="text-sm leading-6 text-zinc-600">
            {typeof tool.description === "string" ? tool.description : "No description available."}
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-900">Live Preview</h2>
          </div>
          {tool.iframeFullUrl && (
            <div className="rounded bg-blue-50 p-3 border border-blue-200">
              <p className="text-xs font-semibold text-blue-900 mb-1">Full URL (for use in other projects):</p>
              <code className="text-xs text-blue-700 break-all block">{tool.iframeFullUrl}</code>
              <p className="text-xs text-blue-600 mt-2">
                Use this URL in iframes from any domain or embed it in other projects.
              </p>
            </div>
          )}
        </div>
        <iframe
          title={tool.title}
          src={tool.iframeUrl}
          className="h-[600px] w-full rounded-md border border-zinc-200 bg-white"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          allow="fullscreen"
        />
      </section>
    </main>
  );
}

