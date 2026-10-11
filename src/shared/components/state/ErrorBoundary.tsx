import { Component, type ErrorInfo, type ReactNode } from "react";

import ErrorState from "./ErrorState";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Batas kesalahan global (SDD §9.1): mencegah layar kosong saat render gagal.
export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Pelaporan error terpusat belum tersedia (SDD-OI-06).
    console.error("ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh items-center justify-center p-6">
          <ErrorState description="Halaman gagal dimuat. Muat ulang untuk mencoba lagi." />
        </div>
      );
    }

    return this.props.children;
  }
}
