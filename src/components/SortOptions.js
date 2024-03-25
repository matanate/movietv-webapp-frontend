import React, { useState } from "react";
import { BsChevronDoubleUp, BsChevronDoubleDown } from "react-icons/bs";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";

const SortOptions = ({
  orderBy,
  setOrderBy,
  isAscending,
  setIsAscending,
  changePageNumber,
}) => {
  const radios = [
    { name: "Rating", value: "rating" },
    { name: "Release Date", value: "release_date" },
    { name: "Title Name", value: "title" },
  ];
  const [checked, setChecked] = useState(false);
  return (
    <>
      <span>Sort By: </span>
      <ButtonGroup size="sm">
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`sortBy-${idx}`}
            type="radio"
            variant="outline-secondary"
            name="sortBy"
            value={radio.value}
            checked={orderBy === radio.value}
            onChange={(e) => {
              setOrderBy(e.currentTarget.value);
              setChecked(e.currentTarget.checked);
              changePageNumber(1);
            }}
          >
            {radio.name}
          </ToggleButton>
        ))}
        <Button
          variant="outline-secondary"
          onClick={() => {
            setIsAscending((prev) => !prev);
            changePageNumber(1);
          }}
        >
          {isAscending ? <BsChevronDoubleDown /> : <BsChevronDoubleUp />}
        </Button>
      </ButtonGroup>
    </>
  );
};

export default SortOptions;
