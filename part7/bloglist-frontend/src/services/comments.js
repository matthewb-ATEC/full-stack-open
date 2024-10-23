import axios from 'axios'
const baseUrl = '/api/blogs'

const create = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, comment)
  return response.data
}

export default { create }
