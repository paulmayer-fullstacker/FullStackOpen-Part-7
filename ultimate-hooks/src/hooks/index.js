// src/hooks/index.js
import { useState, useEffect } from 'react'
import axios from 'axios'

export const useResource = (baseUrl) => {   // Generic custom hook for any RESTful resource. Given a URL, it returnes the data and the tools to modify that data.
  const [resources, setResources] = useState([])   // Local state to store the list of items fetched from the API.

  useEffect(() => {     // useField hook: Simplifies form handling by bundling the state and the input attributes together. This effect runs whenever the baseUrl changes (usually only on mount).  
    const getAll = async () => {   // getAll resources when the component loads and the hook is initialised.
      try {
        const response = await axios.get(baseUrl)   // Get all data from the provided URL.
        setResources(response.data)                // Update state with the newly fetched data.
      } catch (error) {
        console.error('Error fetching resources:', error)
      }
    }
    getAll()
  }, [baseUrl])

  const create = async (newObject) => {   // Create a new resource, POST the resource data to the server and update local state.
    try {
      const response = await axios.post(baseUrl, newObject)
      const newItem = response.data
      setResources(resources.concat(newItem))   // Sync the local state by adding the new item to the existing list.
      return newItem
    } catch (error) {
      console.error('Error creating resource:', error)
    }
  }

  const service = {   // Group the creation logic into a service object.
    create
  }

  return [   // Return the data and the service object in an array (similar to useState).
    resources, service
  ]
}