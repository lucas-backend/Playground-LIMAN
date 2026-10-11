import type { ReactNode } from "react";

import ErrorBoundary from "@/shared/components/state/ErrorBoundary";
import { SessionProvider } from "@/shared/session/SessionProvider";

interface AppProvidersProps {
  children: ReactNode;
}

// Komposisi provider lintas aplikasi (SDD §2.3). Router sengaja berada
// di App agar urutan ErrorBoundary -> Router -> Sesi tetap eksplisit.
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <ErrorBoundary>
      <SessionProvider>{children}</SessionProvider>
    </ErrorBoundary>
  );
}
