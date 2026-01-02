import { KeyFeatureBlock } from "@/lib/models/DTOs/MiniToolDto";
import Image from "next/image";

type KeyFeaturesPresentationProps = {
  keyFeatures: KeyFeatureBlock[];
};

export default function KeyFeaturesPresentation({
  keyFeatures,
}: KeyFeaturesPresentationProps) {
  if (!Array.isArray(keyFeatures) || keyFeatures.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {keyFeatures.map((feature, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-blue-50">
              {feature.image ? (
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-blue-600">
                  <span className="text-xs font-bold">Icon</span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-semibold text-zinc-900">
              {feature.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-zinc-600">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
