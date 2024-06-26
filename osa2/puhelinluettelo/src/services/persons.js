import axios from 'axios'
// Osassa 2 tämä näytti seuraavalta:
// const baseUrl = 'http://localhost:3001/persons'
// Osaa 3 varten tehty muutos:
const baseUrl = '/api/persons'

const getAll = () => {
    return axios.get(baseUrl)
}

const create = newObject => {
    return axios.post(baseUrl, newObject)
}

const remove = id => {
    return axios.delete(`${baseUrl}/${id}`)
}

const edit = (id, updatedObject) => {
    return axios.put(`${baseUrl}/${id}`, updatedObject)
}

export default {
    getAll: getAll,
    create: create,
    remove: remove,
    edit: edit
}