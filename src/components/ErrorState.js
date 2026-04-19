const ErrorState = ({ message, onRetry, missingKey }) => (
  <div
    className="max-w-xl mx-auto my-12 p-6 bg-red-50 border border-red-200 rounded-lg text-center"
    role="alert"
  >
    <h2 className="text-xl font-semibold text-red-700 mb-2">Something went wrong</h2>
    <p className="text-red-600 mb-4">{message}</p>
    {missingKey && (
      <p className="text-sm text-red-700 mb-4">
        Ensure <code className="px-1 bg-red-100 rounded">REACT_APP_NEWS_API_KEY</code> is set in
        your <code className="px-1 bg-red-100 rounded">.env</code> file (see{" "}
        <code className="px-1 bg-red-100 rounded">.env.example</code>), then restart the dev
        server.
      </p>
    )}
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Retry
      </button>
    )}
  </div>
);

export default ErrorState;
