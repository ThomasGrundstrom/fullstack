import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = (blogObject, token) => {
  const request = axios.post(baseUrl, blogObject, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return request.then(response => response.data)
}

const edit = (id, updatedObject, token ) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedObject, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return request.then(response => response.data)
}

const remove = (id, token) => {
  const request = axios.delete(`${baseUrl}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return request.then(response => response.data)
}

export default {
  getAll,
  create,
  edit,
  remove
}