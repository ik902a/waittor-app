interface Props {
  sort: string;
  order: string;
  onSort: (field: string) => void;
}

export function SortControl({ sort, order, onSort }: Props) {
  const btn = (field: string, label: string) => (
    <button
      onClick={() => onSort(field)}
      style={{ fontWeight: sort === field ? "bold" : "normal", marginLeft: 10 }}
    >
      {label} {sort === field && (order === "asc" ? "🔼" : "🔽")}
    </button>
  );

  return (
    <div style={{ fontSize: 14, color: "#666" }}>
      Сортировка:
      {btn("name", "По названию")}
      {btn("release", "По релизу")}
    </div>
  );
}
