import { useNavigate } from "react-router-dom";

import EmptyState from "@/shared/components/state/EmptyState";

import type { DashboardFeature } from "../../model/dashboard";

interface Props {
  features: DashboardFeature[];
}

export default function FeatureGrid({ features }: Props) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-3 gap-4 mt-4 border border-black/10 rounded-xl py-8 px-4 bg-white">
      {features.length > 0 ? (
        features.map((feature) => {
          const FeatureIcon = feature.icon;

          return (
            <button
              key={feature.name}
              type="button"
              onClick={() => navigate(feature.link)}
              className="flex flex-col items-center justify-center gap-2 text-center"
            >
              <div className="text-brand-500 bg-surface-muted rounded-full h-18 w-18 flex items-center justify-center">
                <FeatureIcon className="w-10! h-10!" />
              </div>
              <span className="text-sm font-medium text-slate-700">
                {feature.name}
              </span>
            </button>
          );
        })
      ) : (
        <div className="col-span-3">
          <EmptyState title="Tidak ada fitur" />
        </div>
      )}
    </div>
  );
}
