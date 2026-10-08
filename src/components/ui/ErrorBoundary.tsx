import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Replace with your telemetry provider in a real application.
    if (import.meta.env.DEV) console.error('UI rendering error', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 dark:bg-[#090d16] px-6">
        <section role="alert" className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-xl">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Reload the app to recover from this unexpected UI error.</p>
          {import.meta.env.DEV && this.state.message && (
            <pre className="mt-4 overflow-auto rounded-lg bg-slate-100 dark:bg-slate-950 p-3 text-left text-xs text-rose-600 dark:text-rose-400">{this.state.message}</pre>
          )}
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Reload
          </button>
        </section>
      </main>
    );
  }
}
