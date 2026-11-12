import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled render error", error, errorInfo);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return this.props.fallback ?? (
      <main role="alert">
        <p>Terjadi kesalahan pada halaman.</p>
        <button type="button" onClick={() => this.setState({ error: null })}>Coba lagi</button>
      </main>
    );
  }
}
