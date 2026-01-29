// src/components/User.jsx:
import { useParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ItemCard } from './GlobalStyling' // Import ItemCard from GlobalStyling Componet.

const User = () => {
  const { id } = useParams() // Inside the User component, useParams() returns an object: { id: "123" }. const { id } = useParams() uses destructuring to pull the "123" out and save it into a variable named id.
  const queryClient = useQueryClient() // Hook to access the existing data cache

  // Pull the users from the cache rather than a new API call reduce latency and network TFC.
  const users = queryClient.getQueryData(['users'])
  const user = users?.find((u) => u.id === id)
  // If the user not in the cache, show error
  if (!user) return <p>User not found.</p>

  return (
    // Reuse ItemCard, overriding the default 15px padding with 2rem for a user profile. These ItemCards have not been defined as hoverable. So, they are inactive.
    <ItemCard padding="2rem">
      <h2 style={{ margin: 0, color: '#2c3e50' }}>{user.name}</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>User Profile</p>

      <h3>Added Blogs</h3>
      {user.blogs.length > 0 ? (
        <div style={{ marginTop: '1rem' }}>
          {user.blogs.map((blog) => (
            // Nested Cards: Reuse ItemCard for the list of blogs. Logic: Override the border colour to light gray (#c7bdc1) so it doesn't compete visually with the main blue profile card.
            <ItemCard
              key={blog.id}
              padding="12px 15px"
              style={{ borderLeftColor: '#c7bdc1' }}
            >
              {blog.title}
            </ItemCard>
          ))}
        </div>
      ) : (
        <p style={{ fontStyle: 'italic', color: '#95a5a6' }}>
          No blogs added yet.
        </p>
      )}
    </ItemCard>
  )
}

export default User
