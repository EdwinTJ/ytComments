import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center mt-8">
      <nav className="flex items-center space-x-2" aria-label="Pagination">
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 p-0"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="sr-only">Previous page</span>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className={`h-8 min-w-[2rem] ${
              currentPage === index + 1 ? "bg-blue-50 text-blue-600" : ""
            }`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 p-0"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="sr-only">Next page</span>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </nav>
    </div>
  );
}
