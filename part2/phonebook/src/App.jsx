import { useState, useEffect } from "react";
import personsService from "./services/persons";
import Search from "./components/Search";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  // Use to manage seraching and filtering people
  const [search, setSearch] = useState("");
  const filteredPersons =
    search != ""
      ? persons.filter((person) =>
          person.name.toLowerCase().includes(search.toLowerCase())
        )
      : persons;

  // Fetch the persons data using the service when the DOM loads
  useEffect(() => {
    console.log("effect");
    personsService.getAll().then((initialPersons) => {
      console.log("promise fulfilled");
      setPersons(initialPersons);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Adding new person to phonebook: ", newName, newNumber);

    // Alert and update phone numbers for existing names
    const nameExists = persons.some((person) => person.name === newName);
    if (
      nameExists &&
      window.confirm(
        `${newName} is already added to phonebook, replace old number with a new one?`
      )
    ) {
      const person = persons.find((person) => person.name === newName);
      const updatedPerson = { ...person, number: newNumber };

      personsService
        .updateID(updatedPerson.id, updatedPerson)
        .then((response) => {
          setPersons(
            persons.map((person) =>
              person.id !== response.id ? person : response
            )
          );
          setNewName("");
          setNewNumber("");
        });
      return;
    }

    // Create the new person object
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    // Post the new person using the service and update the state variables
    personsService.create(newPerson).then((returnedPerson) => {
      console.log("Post response: ", returnedPerson);
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  };

  const handleNameChange = (event) => {
    //console.log("Name change: ", event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    //console.log("Number change: ", event.target.value);
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    //console.log("Search change: ", event.target.value);
    setSearch(event.target.value);
  };

  const handleDelete = (id) => {
    console.log("Attempting to delete person with ID:", id);
    const personToDelete = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personsService.deleteID(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
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

      <Persons persons={filteredPersons} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
