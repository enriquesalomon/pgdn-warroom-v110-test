import React from "react";

function CheckboxListAction({
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
      <div className="flex flex-col ">
        {/* Select All Checkbox */}
        <div className="m-2">
          <label className="hover:cursor-pointer">
            <input
              disabled={isWorking}
              className="hover:cursor-pointer mr-2"
              type="checkbox"
              checked={isAllSelected}
              onChange={handleSelectAllChange}
            />
            SELECT ALL
            <hr className="mt-4" />
          </label>
        </div>

        {actions.map((actions) => (
          <div className="m-2" key={actions}>
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
    </>
  );
}

export default CheckboxListAction;
