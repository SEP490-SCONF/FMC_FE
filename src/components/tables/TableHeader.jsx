export default function TableHeader({ onSearch, onExport }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => onSearch(e.target.value)}
        className="border p-2 rounded"
      />
      <button onClick={onExport} className="bg-green-500 text-white px-4 py-2 rounded">
        Export CSV
      </button>
    </div>
  );
}
