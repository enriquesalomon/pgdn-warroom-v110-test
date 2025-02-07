// Tabs.js

import React, { useState } from "react";
import styled, { css } from "styled-components";

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-500);

    &:hover {
      background-color: var(--color-brand-600);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);

  ${(props) => variations[props.variation]}
`;

Button.defaultProps = {
  variation: "primary",
  size: "medium",
};

const Tab = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="w-full">
      <div className="flex">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`w-full ${
              activeTab === index
                ? "bg-[#145A32] text-[#ffedcc] shadow-md"
                : "bg-gray-200 text-gray-800 "
            } px-4 py-2 ${
              index === 0 ? "rounded-l-lg" : "" // Apply rounded-l-lg to the first button
            } ${
              index === tabs.length - 1 ? "rounded-r-lg" : "" // Apply rounded-r-lg to the last button
            }  hover:bg-[#229954] hover:text-[#ffedcc]`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="p-4">{tabs[activeTab].content}</div>
      {/* Conditionally render the validation reminder based on active tab's title */}
      {tabs[activeTab].title === "Validation Configuration" && (
        <div className="bg-yellow-200 text-yellow-800 p-4 rounded-md shadow-md mb-4 mx-8 mt-4">
          <p className="text-md">
            Please note: Only one validation can be run at a time. Running
            multiple validations concurrently is not allowed.
          </p>
        </div>
      )}
    </div>
  );
};

export default Tab;
