// components/StatCard.js
export default function StatCard({ title, value }) {
  return (
    <div className="bg-white shadow rounded-xl border border-gray-100 p-4">
      <div className="text-xs font-medium text-gray-500 uppercase">{title}</div>
      <div className="text-2xl font-bold mt-1 text-gray-900">{value ?? "-"}</div>
    </div>
  );
}