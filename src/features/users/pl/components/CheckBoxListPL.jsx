import React from "react";

function CheckboxListPL({
  options,
  selectedOptions,
  onSelectedOptionsChange,
  isWorking,
}) {
  const handleCheckboxChange = (option) => {
    const updatedOptions = selectedOptions.includes(option.value)
      ? selectedOptions.filter((item) => item !== option.value)
      : [...selectedOptions, option.value];
    onSelectedOptionsChange(updatedOptions);
  };

  return (
    <>
      <div className="flex flex-col">
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

export default CheckboxListPL;
