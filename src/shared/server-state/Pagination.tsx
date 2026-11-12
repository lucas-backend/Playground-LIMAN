export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export function Pagination({
  meta,
  onPageChange,
}: {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}) {
  const pageCount = Math.max(1, Math.ceil(meta.total / meta.pageSize));
  return (
    <nav aria-label="Pagination">
      <button type="button" disabled={meta.page <= 1} onClick={() => onPageChange(meta.page - 1)}>
        Sebelumnya
      </button>
      <span aria-current="page">Halaman {meta.page} dari {pageCount}</span>
      <button type="button" disabled={meta.page >= pageCount} onClick={() => onPageChange(meta.page + 1)}>
        Berikutnya
      </button>
    </nav>
  );
}
