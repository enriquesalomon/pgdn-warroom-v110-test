import React from "react";

function CheckboxList({
  options,
  selectedOptions,
  onSelectedOptionsChange,
  isWorking,
}) {
  // Determine if all options are selected
  const allSelected = options.every((option) =>
    selectedOptions.includes(option.value)
  );
  // Handle the "Select All" checkbox change
  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      // Select all options
      onSelectedOptionsChange(options.map((option) => option.value));
    } else {
      // Deselect all options
      onSelectedOptionsChange([]);
    }
  };

  const handleCheckboxChange = (option) => {
    const updatedOptions = selectedOptions.includes(option.value)
      ? selectedOptions.filter((item) => item !== option.value)
      : [...selectedOptions, option.value];
    onSelectedOptionsChange(updatedOptions);
  };

  return (
    <>
      <div className="flex flex-col">
        <div className="m-2">
          <label className="hover:cursor-pointer">
            <input
              disabled={isWorking}
              className="hover:cursor-pointer mr-2"
              type="checkbox"
              checked={allSelected}
              onChange={handleSelectAllChange}
            />
            SELECT All
            <hr className="mt-4" />
          </label>
        </div>
        {options.map((option) => (
          <div className="m-2" key={option.value}>
            <label className="hover:cursor-pointer">
              <input
                disabled={isWorking}
                className="hover:cursor-pointer mr-2"
                type="checkbox"
                value={option.value}
                checked={selectedOptions.includes(option.value)}
                onChange={() => handleCheckboxChange(option)}
              />
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </>
  );
}

export default CheckboxList;
