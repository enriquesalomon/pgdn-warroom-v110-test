import React from "react";
import Select from "react-select";

function SelectOption({ leaders, register, setValue }) {
  // Transform leaders data into options format required by react-select
  const options = leaders.data.map((leader) => ({
    value: leader.id,
    label: `${leader.firstname} ${leader.lastname}`,
  }));

  // Function to handle the change in the select input
  const handleChange = (selectedOption) => {
    setValue("leaders", selectedOption ? selectedOption.value : "");
  };
  return (
    <div>
      <Select
        id="leaders"
        name="leaders"
        inputId="leaders"
        inputName="leaders"
        options={options}
        placeholder="Select..."
        onChange={handleChange}
        ref={register({
          required: "This field is required",
        })}
      />
    </div>
  );
}

export default SelectOption;
