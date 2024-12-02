import React from "react";
import Input from "./Input";

export default function Search({ onChange, value, terms = "Search", width }) {
  const inputWidth = width || "100rem";
  return (
    <>
      <Input
        type="search"
        placeholder={`${terms}`}
        onChange={onChange}
        width={inputWidth}
        mr="5px"
        value={value}
      />
    </>
  );
}
