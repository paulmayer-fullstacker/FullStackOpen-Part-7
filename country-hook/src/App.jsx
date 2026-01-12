// src/App.jsx:
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {   // Custom hook useField, simplifies input handling by managing the state of a form field.
  const [value, setValue] = useState('')   // Local state to store the text the user inputs.

  const onChange = (event) => {   // Event handler to update the state whenever the user types.
    setValue(event.target.value)
  }

  return {   // Return an object that can be spread directly onto an <input /> element
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {   // Custom hook: useCountry, handles the logic of fetching country data from an external API.
  const [country, setCountry] = useState(null)   // 'country' state will store the API response or a 'not found' status message.

  useEffect(() => {
    if (!name) {   // Do not search if the name field is empty (e.g., on initial page render).
      return
    }
    const getCountry = async () => {
      try {
        const response = await axios.get(   // Asynchronous GET call to the REST Countries API using the 'name' parameter.
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
        )
        
        setCountry({   // If the request is successful, update state with 'found: true' and map the API data to our required object structure.
          found: true,
          data: {      // Format the object to match the component's needs
            name: response.data.name.common,
            capital: response.data.capital[0],
            population: response.data.population,
            flag: response.data.flags.png
          }
        })
      } catch (error) {
        // If the request fails (e.g., 404), set found: false.
        setCountry({ found: false })
      }
    }

    getCountry()
  }, [name]) // Listening for changes to 'name'. The dependency array ensures that getCountry only runs when 'name' field changes.
  
  return country
}

const Country = ({ country }) => {
  if (!country) {   // If the hook has not run yet or has no search term, return null.
    return null
  }

  if (!country.found) {   // If the search was performed but no country was found, return message to render.
    return (
      <div>
        not found...
      </div>
    )
  }

  return (   // If a country is found, display its details.
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {   // App: The main container for the application.
  const nameInput = useField('text')     // Initialize the custom hook for the text input.
  const [name, setName] = useState('')   // Local state to store the name to search for.
  const country = useCountry(name)       // Call the custom hook. It will fetch data whenever 'name' changes.

  const fetch = (e) => {
    e.preventDefault()           // Prevent the browser from reloading the page on form submission
    setName(nameInput.value)     // Update the 'name'. This update triggers the useEffect inside useCountry.
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />   {/* Spread operator (...nameInput): passes type, value, and onChange to the input */}
        <button>find</button>
      </form>
      
      <Country country={country} />   {/* Pass the country state (the result of the hook) to the display component */}
    </div>
  )
}

export default App