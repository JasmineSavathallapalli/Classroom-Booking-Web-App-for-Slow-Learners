export default function Button({
  label,
  name,
  onClick,
  type = "button",
  variant = "primary",
}) {
  const baseStyle = "px-4 py-2 rounded-lg transition font-medium";
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-700",
    secondary: "bg-gray-300 text-black hover:bg-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-700",
    success: "bg-green-500 text-white hover:bg-green-700",
  };

  return (
    <button
      type={type}
      name={name}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant] || variants.primary}`}
    >
      {label}
    </button>
  );
}
