import React, { useState, useEffect } from "react";

function Dropdown() {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    // Fetch options from the backend
    fetch("/api/options") // Replace with your backend API endpoint
      .then((response) => response.json())
      .then((data) => setOptions(data))
      .catch((error) => console.error("Error fetching options:", error));
  }, []);

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <label htmlFor="selectOption">Select an option:</label>
      <select
        id="selectOption"
        value={selectedOption}
        onChange={handleSelectChange}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.id} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedOption && <p>Selected option: {selectedOption}</p>}
    </div>
  );
}

export default Dropdown;
