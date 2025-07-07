import { useState } from "react";

const MultiSelectDropdown = ({
  options,
  onSelectionChange,
  defaultOptionText = "Select an option",
  selectedOptionText = "Selected Items: ",
}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAdd = (e) => {
    const selectedItem = e.target.value;
    if (!selectedItems.includes(selectedItem)) {
      const updatedItems = [...selectedItems, selectedItem];
      setSelectedItems(updatedItems);
      onSelectionChange(updatedItems);
    }
  };

  return (
    <div>
      <select
        className="p-2 border rounded w-full"
        onChange={handleAdd}
        defaultValue=""
      >
        <option value="" disabled>
          {defaultOptionText}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">{selectedOptionText}</h3>
        <div className="flex flex-wrap gap-2">
          {selectedItems.map((item, index) => (
            <span
              key={index}
              className="bg-blue-500 text-white px-3 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiSelectDropdown;
