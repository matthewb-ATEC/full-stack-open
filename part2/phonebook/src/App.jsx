import { useState, useEffect } from "react";
import axios from "axios";
import Search from "./components/Search";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const filteredPersons =
    search != ""
      ? persons.filter((person) =>
          person.name.toLowerCase().includes(search.toLowerCase())
        )
      : persons;

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Adding new person to phonebook: ", newName, newNumber);

    const nameExists = persons.some((person) => person.name === newName);

    if (nameExists) {
      alert(`${newName} is already added to phonebook`);
    } else {
      setPersons(
        persons.concat({
          name: newName,
          number: newNumber,
          id: persons.length + 1,
        })
      );
      setNewName("");
      setNewNumber("");
    }
  };

  const handleNameChange = (event) => {
    console.log("Name change: ", event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    console.log("Number change: ", event.target.value);
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    console.log("Search change: ", event.target.value);
    setSearch(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Search search={search} handleSearchChange={handleSearchChange} />

      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
        handleSubmit={handleSubmit}
      />

      <h3>Persons</h3>

      <Persons persons={filteredPersons} />
    </div>
  );
};

export default App;
