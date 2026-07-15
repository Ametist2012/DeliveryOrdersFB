interface PagerProps {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function Pager({ page, totalPages, hasNextPage, onPageChange, pageSize, onPageSizeChange }: PagerProps) {
  return (
    <div className="pager">
      <div className="pager-size">
        <span>Показывать по</span>
        <select
          className="pager-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="pager-nav">
        <button className="pager-btn" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          ← Назад
        </button>
        <span className="pager-status">
          Страница {page} из {Math.max(totalPages, 1)}
        </span>
        <button className="pager-btn" onClick={() => onPageChange(page + 1)} disabled={!hasNextPage}>
          Вперёд →
        </button>
      </div>
    </div>
  );
}
