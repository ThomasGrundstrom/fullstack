import './index.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import personsService from './services/persons'

const Notification = ({message, type}) => {
  if (message === null) {
    return null
  }
  const className = type
  return (
    <div className={className}>
      {message}
    </div>
  )
}

const FilterForm = ( {filter, changehandler} ) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={changehandler} />
    </div>
  )
}

const AddPersonForm = ( {name, namechangehandler, number, numberchangehandler, submithandler} ) => {
  return (
    <form onSubmit={submithandler}>
      <div>
        name: <input value={name} onChange={namechangehandler} />
      </div>
      <div>
        number: <input value={number} onChange={numberchangehandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const PersonsDisplay = ( {toshow, removehandler} ) => {
  return (
    <div>
      {toshow.map(person => (
        <div key={person.id}>{person.name} {person.number}
        <button onClick={() => removehandler(person.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    personsService.getAll().then(response => {
      setPersons(response.data)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    const names = persons.map(person => person.name)
    if (names.includes(newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace old number with new one?`)) {
        const person = persons.find(person => person.name === newName)
        const editedPerson = { ...person, number: newNumber }
        personsService.edit(person.id, editedPerson).then(() => {
          setPersons(persons.map(person => person.name !== newName ? person : editedPerson))
          setNewName('')
          setNewNumber('')
          setMessageType('notification')
          setMessage(`Edited ${person.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        }).catch(error => {
          setMessageType('error')
          setMessage(`Information of ${person.name} has already been deleted from the server`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
      }
    } else {
      personsService.create(personObject).then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
        setMessageType('notification')
        setMessage(`Added ${personObject.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      // Seuraavat lisättiin osassa 3:
      .catch(error => {
        setMessageType('error')
        setMessage(error.response.data['error'])
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    }
  }
  
  const removePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      personsService.remove(id).then(() => {
        setPersons(persons.filter(person => person.id !== id))
        setMessageType('notification')
        setMessage(`Removed ${person.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }).catch(error => {
        setMessageType('error')
        setMessage(`Information of ${person.name} has already been deleted from the server`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <FilterForm filter={filter} changehandler={handleFilterChange} />
      <h2>add a new</h2>
      <AddPersonForm 
      name={newName} namechangehandler={handleNameChange} number={newNumber} numberchangehandler={handleNumberChange} submithandler={addPerson}
      />
      <h2>Numbers</h2>
      <PersonsDisplay toshow={personsToShow} removehandler={removePerson} />
    </div>
  )

}

export default App
