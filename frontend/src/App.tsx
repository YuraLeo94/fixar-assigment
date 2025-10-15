import { ToastContainer } from './components/ToastContainer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LogsTable } from './components/LogsTable';
import { useLogs } from './hooks/useLogs';

function App() {
  const { logs, loading, error, updateLog, deleteLog } = useLogs();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  className="w-8 h-8 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Log Management System</h1>
                  <p className="text-sm text-gray-600">View, edit, and manage system logs</p>
                </div>
              </div>
            </div>
          </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div
              className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <div className="p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    System Logs
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({logs.length} {logs.length === 1 ? 'entry' : 'entries'})
                    </span>
                  </h2>
                </div>
                <LogsTable logs={logs} onUpdate={updateLog} onDelete={deleteLog} />
              </div>
            )}
          </div>
      </main>

      <footer className="mt-12 pb-8 text-center text-sm text-gray-600">
        <p>Built with React, TypeScript, and Tailwind CSS</p>
      </footer>

      <ToastContainer />
    </div>
  );
}

export default App;
