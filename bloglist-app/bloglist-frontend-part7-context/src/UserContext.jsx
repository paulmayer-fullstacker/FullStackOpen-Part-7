// src/UserContext.jsx:
/* eslint-disable react-refresh/only-export-components */
// Centralise complex state logic, while offering global access to it.
import { createContext, useReducer, useContext } from 'react'
// Reducer: Manages login/logout transitions.
const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload // Sets state to the user object from the backend.
    case 'CLEAR_USER':
      return null // Clears state (used for logout).
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  // user state will either be null or an object { token, username, name }.
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => useContext(UserContext)[0] // Custom Hook (Helper): Returns only the user object (e.g., { name: "Mayer", token: "..." }).
export const useUserDispatch = () => useContext(UserContext)[1] // Hook returns the function used to trigger changes to the user (i.e.: SET_USER, CLEAR_USER).

export default UserContext
