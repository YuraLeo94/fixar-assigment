import { useState } from 'react';
import { ToastContainer } from './components/ToastContainer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LogsTable } from './components/LogsTable';
import { AddLogModal } from './components/AddLogModal';
import { useLogs } from './hooks/useLogs';

function App() {
  const { logs, loading, error, createLog, updateLog, deleteLog } = useLogs();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLog = async (owner: string, logText: string) => {
    setIsCreating(true);
    try {
      await createLog({ owner, logText });
      setIsAddModalOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
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
                <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    System Logs
                    <span className="ml-2 text-sm font-normal text-gray-600">
                      ({logs.length} {logs.length === 1 ? 'entry' : 'entries'})
                    </span>
                  </h2>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="
                      inline-flex items-center gap-2 px-4 py-2 text-sm font-medium
                      text-white bg-blue-600 rounded-md hover:bg-blue-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                      transition-colors duration-200
                    "
                    aria-label="Create new log"
                  >
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create New Log
                  </button>
                </div>
                <LogsTable logs={logs} onUpdate={updateLog} onDelete={deleteLog} />
              </div>
            )}
          </div>
      </main>

      <footer className="mt-auto py-6 text-center text-sm text-gray-600 border-t border-gray-200">
        <p>Built with React, TypeScript, and Tailwind CSS</p>
      </footer>

      <ToastContainer />

      <AddLogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateLog}
        isCreating={isCreating}
      />
    </div>
  );
}

export default App;
