import { useState } from 'react';

function NameInput() {

  const [name, setName] = useState("");
  
  const handleNameChange = (event) => {
    setName(event.target.value);
  }

  return (
    <input type="text" value={name} onChange={handleNameChange} />
  )
}

export default NameInput;