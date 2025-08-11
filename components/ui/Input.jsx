export default function Input({ label, id, type = 'text', value, onChange, placeholder, className = '' }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label htmlFor={id} className="text-sm font-medium text-neutral-700">{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-neutral-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}
