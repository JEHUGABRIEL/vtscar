import { Component } from "react";
import { withTranslation } from "react-i18next";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    const { t } = this.props;

    if (this.state.hasError) {
      return (
        <div className="eb-fade-in min-h-screen flex items-center justify-center bg-white px-6">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>

            {/* Title */}
            <h1 className="font-heading font-bold text-2xl md:text-3xl text-gray-900 mb-3">
              {t("errorBoundary.title")}
            </h1>

            {/* Description */}
            <p className="text-gray-500 leading-relaxed mb-2">
              {t("errorBoundary.description")}
            </p>
            <p className="text-gray-400 text-sm mb-8">
              {t("errorBoundary.subtitle")}
            </p>

            {/* Error detail (dev only) */}
            {this.state.error && (
              <details className="text-left mb-8 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <summary className="text-sm font-medium text-gray-500 cursor-pointer select-none">
                  {t("errorBoundary.techDetails")}
                </summary>
                <pre className="mt-3 text-xs text-red-600 whitespace-pre-wrap overflow-auto max-h-32 font-mono">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {t("common.retry")}
              </button>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                <Home className="w-4 h-4" />
                {t("common.home")}
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withTranslation()(ErrorBoundary);
