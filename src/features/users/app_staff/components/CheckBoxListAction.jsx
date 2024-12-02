import React from "react";

function CheckBoxListAction({
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

  return (
    <>
      <div className="flex flex-col ">
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

export default CheckBoxListAction;
