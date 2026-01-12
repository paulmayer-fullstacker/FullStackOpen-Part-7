// src/App.jsx:
/* eslint-disable react/prop-types */
import { useState } from 'react'
import { useField } from './hooks'   // When we point an import statement to a directory (./hooks), the build tool (Vite) automatically looks for a file named index.js inside that folder.

import {       // Import tools from react-router-dom:
  Routes,        // Container for all possible Route definitions.
  Route,         // Maps a specific URL path to a React component.
  Link,          // Replaces <a> tags. Allows navigation without refreshing the page.
  useMatch,      // Hook to extract parameters (like IDs) from the current URL.
  useNavigate    // Hook to programmatically change the URL (redirects).
} from 'react-router-dom'

const Menu = () => {   // Navigation component using Link. The 'to' props match the 'path' defined in Routes.
  const padding = { paddingRight: 5 }
  return (
    <div>
      <Link style={padding} to="/">anecdotes</Link>
      <Link style={padding} to="/create">create new</Link>
      <Link style={padding} to="/about">about</Link>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (   // Display the full list. Each item is a Link that points to a specific ID path.
        <li key={anecdote.id} >
          {/* This creates the clickable link */}
          <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>  {/* Dynamic routing: clicking this changes URL (e.g., to /anecdotes/1) */}
        </li>
      ))}
    </ul>
  </div>
)

const Anecdote = ({ anecdote }) => {  // Individual anecdote view component. Receives the specific anecdote object as a prop.
  // Guard clause: if the URL ID doesn't match an anecdote, show a message. e.g., if user types in URL with invalid Id.
  if (!anecdote) return <div>Anecdote not found</div>
  
  return (
    <div> 
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>for more info see <a href={anecdote.info} target="_blank" rel="noreferrer">{anecdote.info}</a></p>
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>
    {/* static content */}
    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {      // Initialise the text input fields
  // We extract 'reset' into a uniquely named variable 
  
  const { reset: resetContentField, ...content } = useField('text')     // Extract 'reset' and place it in a uniquely named variable. 
  const { reset: resetAuthorField, ...author } = useField('text')       // Then gather the rest into an object ({type, value, onChange}).
  const { reset: resetInfoField, ...info } = useField('text')           // This removes the Warning: "Invalid value for prop `reset` on <input> tag." from previouse strategy.

  const navigate = useNavigate() // Hook to redirect the user. navigate is a function that lets us "push" a new URL to the browser history

  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({    // 
      content: content.value,    // Access the value property of the hook object
      author: author.value,
      info: info.value,
      votes: 0
    })
    navigate('/') // Send user back to the list after submission of new anecdote
  }

  const handleReset = (e) => {  // Use handleReset function to reset the field values.
    e.preventDefault()         // Prevent form resubmission. The button is inside the form
    resetContentField()
    resetAuthorField()
    resetInfoField()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} /> 
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>reset</button>
      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')   // Notification state

  const addNew = (anecdote) => {   // 'anecdote' is the object { content, author, info, votes } passed from handleSubmit
    anecdote.id = Math.round(Math.random() * 10000)    // Add a unique (ish) id.
    setAnecdotes(anecdotes.concat(anecdote))
  
    setNotification(`a new anecdote ${anecdote.content} created!`)   // Set the notification message for addNew anecdote success.
    setTimeout(() => {
      setNotification('')   // setNotification back to empty string,
    }, 5000)               // after a 5 second delay.
  }

/* For future development: 
  These functions will be used when we add the 'vote' button functionality to the individual anecdote views.
*/
/* 
  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }
*/  
  // useMatch checks if the current URL matches the pattern '/anecdotes/:id'.  It is called every time the component renders (on Every URL change).
  const match = useMatch('/anecdotes/:id')
  const anecdote = match     // If there is a match, find the specific anecdote object from our state
    ? anecdotes.find(a => a.id === Number(match.params.id))
    : null

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      
      {notification && (   //  Conditionally render the notification with a border. Short-circuit evaluation: only show the div if notification is not an empty string.
        <div style={{ border: '2px solid red', padding: 5, marginBottom: 10 }}>
          {notification}
        </div>
      )}

      <Routes>   {/* The Router Switchboard: Only one Route inside here will render at a time */}
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />           {/* Exact match for the homepage */}
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={anecdote} />} />    {/* Parameterized route: the :id part is variable */}
        <Route path="/create" element={<CreateNew addNew={addNew} />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
