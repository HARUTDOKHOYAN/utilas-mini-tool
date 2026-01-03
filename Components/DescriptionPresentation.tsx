import Image from "next/image";
import {DescriptionBlock} from "@/lib/models/DTOs/MiniToolDto";

type DescriptionPresentationProps = {
  description: DescriptionBlock[];
  toolTitle: string;
};

export default function DescriptionPresentation({
  description,
  toolTitle,
}: DescriptionPresentationProps) {
  if (!Array.isArray(description) || description.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8">
      {description.map((block, index) => (
        <div key={index} className="overflow-hidden rounded-md border border-zinc-200">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-zinc-200">
              <tr className="align-top">
                <td className="w-40 bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Block
                </td>
                <td className="px-4 py-3 text-zinc-900">#{index + 1}</td>
              </tr>

              <tr className="align-top">
                <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Title
                </td>
                <td className="px-4 py-3 text-zinc-900">
                  {block.title || "—"}
                </td>
              </tr>

              <tr className="align-top">
                <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Button Link
                </td>
                <td className="px-4 py-3 text-zinc-900">
                  {block.buttonLink ? (
                    <a
                      href={block.buttonLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {block.buttonLink}
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
              </tr>

              <tr className="align-top">
                <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Orientation
                </td>
                <td className="px-4 py-3 text-zinc-900">
                  {block.orientation || "—"}
                </td>
              </tr>

              <tr className="align-top">
                <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Text
                </td>
                <td className="px-4 py-3 text-zinc-900 whitespace-pre-line">
                  {block.text || "—"}
                </td>
              </tr>

              <tr className="align-top">
                <td className="bg-zinc-50 px-4 py-3 font-medium text-zinc-700">
                  Image
                </td>
                <td className="px-4 py-3 text-zinc-900">
                  {block.image ? (
                    <div className="relative h-28 w-44 overflow-hidden rounded-md bg-zinc-100">
                      <Image
                        src={block.image}
                        alt={`${toolTitle} - Description image ${index + 1}`}
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
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

