import { useEffect, useState } from 'react'
import axios from 'axios'

const CountriesDisplay = ( {filteredCountries, showCountryInfo} ) => {
  if (filteredCountries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
  if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    return (
      <div>
        <h1>{country.name.common}</h1>
        <p>capital {country.capital}</p>
        <p>area {country.area}</p>
        <br />
        <b>languages:</b>
        <ul>
          {Object.values(country.languages).map(language => (
            <li key={language}>{language}</li>
          ))}
        </ul>
        <img src={country.flags['png']} />
      </div>
    )
  }
  return (
    <div>
      {filteredCountries.map(country => (
        <div key={country.name.common}>
          {country.name.common} <button key={country.name.common} onClick={() => showCountryInfo(country.name.common)}>show</button>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios.get(`${baseUrl}/api/all`).then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const showCountryInfo = (country) => {
    setFilter(country)
  }
  
  let filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
      <CountriesDisplay filteredCountries={filteredCountries} showCountryInfo={showCountryInfo} />
    </div>
  )
}

export default App
