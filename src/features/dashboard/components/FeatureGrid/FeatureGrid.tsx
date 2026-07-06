import type { featureType } from "./types";

interface Props {
  features: featureType[];
}

export default function FeatureGrid({ features }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4 border border-black/10 rounded-xl py-8 px-4 bg-white">
      {features.length > 0
        ? features.map((feature) => {
            const FeatureIcon = feature.icon;

            return (
              <a
                key={feature.name}
                href={feature.link}
                className="flex flex-col items-center justify-center gap-2 text-center"
              >
                <div className="text-blue-500 bg-blue-100 rounded-full h-18 w-18 flex items-center justify-center">
                  <FeatureIcon className="w-10! h-10!" />
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {feature.name}
                </span>
              </a>
            );
          })
        : "Tidak ada Fitur"}
    </div>
  );
}
