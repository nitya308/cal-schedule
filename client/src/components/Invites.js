import React from 'react';
import { useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

const fetchData = (inputValue, callback) => {
  setTimeout(() => {
    axios.get('/lookup', { params: { search: inputValue } })
      .then((result) => {
        const data = result.data;
        console.log(data);
        callback(data);
      })
      .catch((error) => {
        console.log(error, "error retrieving search results");
      });
  }, 10);
};

function Invites(props) {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleChange = (options) => {
    setSelectedOptions(options.map((option) => option.value));
  };

  return (
    <>
      <AsyncSelect
        isSearchable={true}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        formatOptionLabel={(option) => <div>{option.label}</div>}
        loadOptions={fetchData}
        onChange={handleChange}
        placeholder="Search for a person..."
        isDisabled={props.disabled}
        isMulti
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