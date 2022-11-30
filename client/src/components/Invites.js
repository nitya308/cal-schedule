import React from 'react';
import { useState } from 'react';
import AsyncSelect from 'react-select/async';

const colourOptions = [
  { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
  { value: 'blue', label: 'Blue', color: '#0052CC', isDisabled: true },
  { value: 'purple', label: 'Purple', color: '#5243AA' },
  { value: 'red', label: 'Red', color: '#FF5630', isFixed: true },
  { value: 'orange', label: 'Orange', color: '#FF8B00' },
  { value: 'yellow', label: 'Yellow', color: '#FFC400' },
  { value: 'green', label: 'Green', color: '#36B37E' },
  { value: 'forest', label: 'Forest', color: '#00875A' },
  { value: 'slate', label: 'Slate', color: '#253858' },
  { value: 'silver', label: 'Silver', color: '#666666' },
];

const filterColors = (inputValue) => {
  return colourOptions.filter((i) =>
    i.label.toLowerCase().includes(inputValue.toLowerCase())
  );
};

const promiseOptions = (inputValue) =>
  new Promise(function (myResolve, myReject) {
    setTimeout(() => { myResolve(filterColors(inputValue)); }, 1000);
  });

function Invites(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (options) => {
    setSelectedOptions(options);
  };

  return (
    <>
      <AsyncSelect
        isMulti
        cacheOptions
        loadOptions={promiseOptions}
        onChange={handleChange}
        placeholder="Search for a person..."
        isDisabled = {props.disabled}
      />
      <button style={styles.submitButton}
        onClick={() => { props.createEvent(selectedOptions) }}
        disabled={props.disabled}>
        Create Event
      </button>
    </>
  )
};

export default Invites;

const styles = {
  submitButton: {
    marginTop: 40,
    borderRadius: 5,
  }
};