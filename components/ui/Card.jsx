export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow border border-gray-200 p-6 ${className}`}>
      {children}
    </div>
  );
}