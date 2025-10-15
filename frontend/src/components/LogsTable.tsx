import { useState } from 'react';
import type { Log } from '../types/log';
import { EditableCell } from './EditableCell';
import { DeleteModal } from './DeleteModal';
import { Pagination } from './Pagination';
import { usePagination } from '../hooks/usePagination';

interface LogsTableProps {
  logs: Log[];
  onUpdate: (id: string, data: { owner?: string; logText?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function LogsTable({ logs, onUpdate, onDelete }: LogsTableProps) {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; logId: string | null }>({
    isOpen: false,
    logId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    paginatedData,
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({ data: logs, itemsPerPage: 10 });

  const handleUpdate = async (id: string, field: 'owner' | 'logText', value: string) => {
    try {
      await onUpdate(id, { [field]: value });
    } catch (error) {
      console.error('Failed to update log:', error);
    }
  };

  const handleDeleteClick = (logId: string) => {
    setDeleteModal({ isOpen: true, logId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.logId) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteModal.logId);
      setDeleteModal({ isOpen: false, logId: null });
    } catch (error) {
      console.error('Failed to delete log:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <svg
          className="w-12 h-12 text-gray-400 mb-4"
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
        <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
        <p className="text-sm text-gray-600">There are no logs to display at this time.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="hidden md:block overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300" role="table">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Owner
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Created At
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Updated At
              </th>
              <th
                scope="col"
                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              >
                Log Text
              </th>
              <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 sm:pr-6"
              >
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <EditableCell
                    value={log.owner}
                    onSave={(value) => handleUpdate(log.id, 'owner', value)}
                    placeholder="Owner"
                  />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {formatDate(log.createdAt)}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                  {formatDate(log.updatedAt)}
                </td>
                <td className="px-3 py-4 text-sm max-w-md">
                  <EditableCell
                    value={log.logText}
                    onSave={(value) => handleUpdate(log.id, 'logText', value)}
                    placeholder="Log text"
                    multiline
                  />
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                  <button
                    onClick={() => handleDeleteClick(log.id)}
                    className="
                      text-red-600 hover:text-red-900 focus:outline-none focus:ring-2
                      focus:ring-offset-2 focus:ring-red-500 rounded px-2 py-1
                      transition-colors duration-200
                    "
                    aria-label={`Delete log by ${log.owner}`}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {paginatedData.map((log) => (
          <div
            key={log.id}
            className="bg-white shadow rounded-lg p-4 space-y-3 border border-gray-200"
          >
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Owner
              </label>
              <EditableCell
                value={log.owner}
                onSave={(value) => handleUpdate(log.id, 'owner', value)}
                placeholder="Owner"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Created At
                </label>
                <p className="text-sm text-gray-900">{formatDate(log.createdAt)}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Updated At
                </label>
                <p className="text-sm text-gray-900">{formatDate(log.updatedAt)}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Log Text
              </label>
              <EditableCell
                value={log.logText}
                onSave={(value) => handleUpdate(log.id, 'logText', value)}
                placeholder="Log text"
                multiline
              />
            </div>

            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={() => handleDeleteClick(log.id)}
                className="
                  w-full flex items-center justify-center gap-2 px-4 py-2 text-sm
                  font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
                  transition-colors duration-200
                "
                aria-label={`Delete log by ${log.owner}`}
              >
                <svg
                  className="w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Delete Log
              </button>
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
        onPrevious={previousPage}
        onNext={nextPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
      />

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, logId: null })}
        onConfirm={handleDeleteConfirm}
        itemName={
          deleteModal.logId
            ? `the log by "${logs.find((l) => l.id === deleteModal.logId)?.owner}"`
            : 'this log'
        }
        isDeleting={isDeleting}
      />
    </div>
  );
}
