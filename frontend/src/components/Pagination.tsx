import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { ReactNode } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className = '',
}: PaginationProps) => {
    const maxVisiblePages = 5;

    const getPageNumbers = (): (number | string)[] => {
        if (totalPages <= maxVisiblePages) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        const pages: (number | string)[] = [];
        if (startPage > 1) pages.push(1);
        if (startPage > 2) pages.push('...');
        for (let i = startPage; i <= endPage; i++) pages.push(i);
        if (endPage < totalPages - 1) pages.push('...');
        if (endPage < totalPages) pages.push(totalPages);

        return pages;
    };

    const renderPageButton = (page: number | string, index: number): ReactNode => {
        if (page === '...') {
            return (
                <span key={index} className="px-3 py-1 text-gray-400">
                    <MoreHorizontal className="h-4 w-4" />
                </span>
            );
        }

        const isCurrent = page === currentPage;
        return (
            <button
                key={index}
                onClick={() => onPageChange(page as number)}
                className={`px-3 py-1 min-w-[36px] border rounded-lg text-sm transition-colors ${isCurrent
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                aria-current={isCurrent ? 'page' : undefined}
            >
                {page}
            </button>
        );
    };

    return (
        <div className={`flex items-center justify-between px-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm ${className}`}>
            <div className="flex-1 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="h-4 w-4 text-gray-700" />
                </button>

                <div className="flex items-center gap-1 mx-2">
                    {getPageNumbers().map(renderPageButton)}
                </div>

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    aria-label="Next page"
                >
                    <ChevronRight className="h-4 w-4 text-gray-700" />
                </button>
            </div>
        </div>
    );
};