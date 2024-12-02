import React from "react";

function CheckBoxListBrgy({
  actions,
  selectedActions,
  onSelectedActionsChange,
  isWorking,
}) {
  const handleCheckboxChange = (actions) => {
    const updatedOptions = selectedActions.includes(actions)
      ? selectedActions.filter((item) => item !== actions)
      : [...selectedActions, actions];
    onSelectedActionsChange(updatedOptions);
  };

  const handleSelectAllChange = () => {
    if (selectedActions.length === actions.length) {
      onSelectedActionsChange([]); // Deselect all if all are selected
    } else {
      onSelectedActionsChange(actions); // Select all
    }
  };
  const isAllSelected = selectedActions.length === actions.length;
  return (
    <>
      <div className="flex flex-col">
        {/* Select All Checkbox */}
        <div className="mb-6">
          Select only the Barangays that this user is permitted to view.
        </div>
        {/* <p>to view for this certain user</p> */}
        <div className="m-1">
          <label className="hover:cursor-pointer">
            <input
              disabled={isWorking}
              className="hover:cursor-pointer mr-2"
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAllChange}
            />
            SELECT ALL
            <hr className="mb-6 mt-1" />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {" "}
          {/* Two-column grid layout */}
          {actions.map((actions) => (
            <div className="ml-1" key={actions}>
              <label className="hover:cursor-pointer">
                <input
                  disabled={isWorking}
                  className="hover:cursor-pointer mr-2"
                  type="checkbox"
                  value={actions}
                  checked={selectedActions.includes(actions)}
                  onChange={() => handleCheckboxChange(actions)}
                />
                {actions}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default CheckBoxListBrgy;
