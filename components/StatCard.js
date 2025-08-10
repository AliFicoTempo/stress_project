// components/StatCard.js
export default function StatCard({ title, value }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-lg">
      <div className="text-xs text-gray-300 uppercase">{title}</div>
      <div className="text-2xl font-bold mt-1">{value ?? "-"}</div>
    </div>
  );
}