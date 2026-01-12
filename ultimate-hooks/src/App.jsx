import { useState } from 'react'
import { useResource } from './hooks' // Importing our hook(s). Build tool automatically looks for index.js in the specified directory.

const useField = (type) => {   // Custom hook to manage a single input field's state.
  const [value, setValue] = useState('')

  const onChange = (event) => {   // Updates the state whenever the user types in the input field.
    setValue(event.target.value)
  }

  const reset = () => {    // Reset function: Clear the input fields after use. 
    setValue('')
  }

  return {   // Return attributes ready for an <input /> and the reset function.
    type,
    value,
    onChange,
    reset
  }
}

const App = () => {

  const { reset: resetNoteContentField, ...content } = useField('text')   // Destructure reset away from the attributes we want to ...spread into the input.
  const { reset: resetNameField, ...name } = useField('text')            // Extract the reset function and renames it to resetNameField so you can use it in our submit handler.
  const { reset: resetNumberField, ...number } = useField('text')       // Collect the remaining properties (type, value, onChange) into a new object called content. Thus, {...content} does not contain reset.

  const [notes, noteService] = useResource('http://localhost:3005/notes')   // Initializing two separate instances of theuseResource hook for two different endpoints.
  const [persons, personService] = useResource('http://localhost:3005/persons')

  const handleNoteSubmit = (event) => {   // Submission logic for the Note form.
    event.preventDefault()               // Prevent page reload.
    noteService.create({ content: content.value })   // API call via hook.
    resetNoteContentField()            // Clear the new note input text field.
  }

  const handlePersonSubmit = (event) => {   // Submission logic for the Person form.
    event.preventDefault()
    personService.create({ name: name.value, number: number.value })
    resetNameField()   // Clear the new person/name input text field.
    resetNumberField() // Clear the new person/number field.
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />    {/* spread operator (...): take every key-value pair in the content object and turn them into individual props for this input." */}
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}   {/* Render the notes list */}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br/>    {/* Multiple inputs managed by different useField instances */}
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}   {/* Render the persons list */}
    </div>
  )
}

export default App