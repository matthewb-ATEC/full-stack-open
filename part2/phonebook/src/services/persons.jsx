import axios from "axios";
const baseURL = "/api/persons";

const getAll = () => {
  console.log("Service: Get all persons");
  const request = axios.get(baseURL);
  return request.then((response) => response.data);
};

const create = (newPerson) => {
  console.log("Service: Post new person");
  const request = axios.post(baseURL, newPerson);
  return request.then((response) => response.data);
};

const updateID = (id, updatedPerson) => {
  console.log("Service: Put update");
  const request = axios.put(`${baseURL}/${id}`, updatedPerson);
  return request.then((response) => response.data);
};

const deleteID = (id) => {
  console.log("Service: Deleting person");
  const request = axios.delete(`${baseURL}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, create, updateID, deleteID };
