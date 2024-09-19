import { useState, useEffect } from "react";
import personsService from "./services/persons";
import Notification from "./components/Notification";
import Search from "./components/Search";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [message, setMessage] = useState(null);
  const [messageStyle, setMessageStyle] = useState(null);

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
      console.log("Existing person", person);
      const updatedPerson = { ...person, number: newNumber };
      console.log("Updated person", updatedPerson);

      personsService
        .updateID(updatedPerson.id, updatedPerson)
        .then((response) => {
          setPersons(
            persons.map((person) =>
              person.id !== response.id ? person : response
            )
          );

          setMessageStyle("success");
          setMessage(`${updatedPerson.name} updated successfully`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
          setMessageStyle("error");
          setMessage(
            `${updatedPerson.name} has already been removed from the server`
          );
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
      setNewName("");
      setNewNumber("");
      return;
    }

    // Create the new person object
    const newPerson = {
      name: newName,
      number: newNumber,
    };

    // Post the new person using the service and update the state variables
    personsService
      .create(newPerson)
      .then((returnedPerson) => {
        console.log("Post response: ", returnedPerson);
        setPersons(persons.concat(returnedPerson));

        setMessageStyle("success");
        setMessage(`${returnedPerson.name} added successfully`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      })
      .catch((error) => {
        console.log(error);
        setMessageStyle("error");
        setMessage(`${returnedPerson.name} could not be added`);
        setTimeout(() => {
          setMessage(null);
        }, 5000);
      });
    setNewName("");
    setNewNumber("");
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

  const handleDelete = (id) => {
    console.log("Attempting to delete person with ID:", id);
    const personToDelete = persons.find((person) => person.id === id);

    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      personsService
        .deleteID(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));

          setMessageStyle("success");
          setMessage(`${personToDelete.name} has been removed from server`);
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        })
        .catch((error) => {
          console.log(error);
          setMessageStyle("error");
          setMessage(
            `${personToDelete.name} has already been removed from server`
          );
          setTimeout(() => {
            setMessage(null);
          }, 5000);
        });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} messageStyle={messageStyle} />

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
