export default function Select({ label, name, options = [], value, onChange }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}
      <select
        value={value}
        onChange={onChange}
        name={name}
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option, index) => (
          <option key={index} value={option.value || option } title={option.title || ""}>
            {option.value || option}
          </option>
        ))}
      </select>
    </div>
  );
}
