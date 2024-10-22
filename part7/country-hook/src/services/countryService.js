import axios from "axios";

const getCountry = async (name) => {
  const request = axios.get(
    `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
  );
  const response = await request;
  return response.data;
};

export default { getCountry };
