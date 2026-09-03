import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught economy simulation error:', error, errorInfo);
  }

  private handleRestart = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-6">
          <div className="max-w-md w-full bg-surface border border-border rounded-card p-8 shadow-lift text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-statusWarning/20 flex items-center justify-center text-statusWarning text-2xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold text-textMain mb-2">Let's Restart the Machine</h1>
            <p className="text-base text-textMuted mb-6">
              The economy simulation encountered an unexpected hiccup. Don't worry, we can restart safely without losing your lesson context!
            </p>
            <button
              onClick={this.handleRestart}
              className="w-full py-3 px-6 rounded-btn bg-accentYellow text-textMain font-bold text-base hover:brightness-105 active:scale-95 transition-all shadow-soft min-h-[44px]"
            >
              Restart Economy
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
