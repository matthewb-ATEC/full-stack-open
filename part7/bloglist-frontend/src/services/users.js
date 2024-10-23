import axios from 'axios'
const baseUrl = '/api/users'

const get = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export default { get }
