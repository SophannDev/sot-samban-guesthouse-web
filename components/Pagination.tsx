import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PageInfo {
  last: boolean;
  first: boolean;
  size: number;
  empty: boolean;
  total_pages: number;
  current_page: number;
  current_total_elements: number;
  total_elements: number;
}

interface PaginationProps {
  pageInfo: PageInfo;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showResultsInfo?: boolean;
  className?: string;
  variant?: "default" | "simple" | "compact";
}

const Pagination: React.FC<PaginationProps> = ({
  pageInfo,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showPageSizeSelector = true,
  showResultsInfo = true,
  className = "",
  variant = "default",
}) => {
  const { current_page, total_pages, first, last, size, total_elements } =
    pageInfo;

  // Don't render if there's only one page or no data
  if (total_pages <= 1) {
    return null;
  }

  const startItem = current_page * size + 1;
  const endItem = Math.min((current_page + 1) * size, total_elements);

  const handlePageSizeChange = (value: string) => {
    onPageSizeChange(parseInt(value));
  };

  // Generate page numbers for navigation
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show around current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(0, current_page - delta);
      i <= Math.min(total_pages - 1, current_page + delta);
      i++
    ) {
      range.push(i);
    }

    if (range[0] > 0) {
      if (range[0] > 1) {
        rangeWithDots.push(0, "...");
      } else {
        rangeWithDots.push(0);
      }
    }

    rangeWithDots.push(...range);

    if (range[range.length - 1] < total_pages - 1) {
      if (range[range.length - 1] < total_pages - 2) {
        rangeWithDots.push("...", total_pages - 1);
      } else {
        rangeWithDots.push(total_pages - 1);
      }
    }

    return rangeWithDots;
  };

  const CompactPagination = () => (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(current_page - 1)}
        disabled={first}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm font-medium px-2">
        {current_page + 1} / {total_pages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(current_page + 1)}
        disabled={last}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  const SimplePagination = () => (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}
    >
      {showResultsInfo && (
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {total_elements} results
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page - 1)}
          disabled={first}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm font-medium px-4">
          Page {current_page + 1} of {total_pages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(current_page + 1)}
          disabled={last}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const DefaultPagination = () => (
    <Card className={className}>
      <CardContent className="pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Results Info */}
          {showResultsInfo && (
            <div className="text-sm text-gray-600 order-2 lg:order-1">
              Showing {startItem} to {endItem} of {total_elements} results
            </div>
          )}

          {/* Page Size Selector */}
          {showPageSizeSelector && (
            <div className="flex items-center space-x-2 order-3 lg:order-2">
              <span className="text-sm text-gray-600">Show:</span>
              <Select
                value={size.toString()}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option} per page
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center space-x-1 order-1 lg:order-3">
            {/* First Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(0)}
              disabled={first}
              className="hidden sm:flex"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Previous Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(current_page - 1)}
              disabled={first}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>

            {/* Page Numbers */}
            <div className="hidden md:flex items-center space-x-1">
              {getPageNumbers().map((pageNumber, index) => (
                <React.Fragment key={index}>
                  {pageNumber === "..." ? (
                    <span className="px-2 text-gray-400">...</span>
                  ) : (
                    <Button
                      variant={
                        pageNumber === current_page ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => onPageChange(pageNumber as number)}
                      className="min-w-[2.5rem]"
                    >
                      {(pageNumber as number) + 1}
                    </Button>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Current Page Info (Mobile) */}
            <div className="md:hidden">
              <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded">
                {current_page + 1} / {total_pages}
              </span>
            </div>

            {/* Next Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(current_page + 1)}
              disabled={last}
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Last Page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(total_pages - 1)}
              disabled={last}
              className="hidden sm:flex"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Render based on variant
  switch (variant) {
    case "compact":
      return <CompactPagination />;
    case "simple":
      return <SimplePagination />;
    default:
      return <DefaultPagination />;
  }
};

export default Pagination;
