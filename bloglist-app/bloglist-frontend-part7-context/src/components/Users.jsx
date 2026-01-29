// src/components/Users.jsx:
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
// import styled from 'styled-components' // Import the styled component.
import { ItemCard } from './GlobalStyling' // Imported ItemCard from GlobalStyling
import userService from '../services/users' // Import the new Usr service.

const Users = () => {
  // useQuery fetches data. 'users' is the cache key. userService.getAll is the API call.
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  })
  // Basic guard clause to show a loading state while the API responds. Generally only seen under fault conditions, when page is not in fact loading!
  if (isLoading) return <div>Loading users...</div>

  return (
    <div>
      <h2>Users</h2>
      <div // Container div using Flexbox to stack the user cards vertically with a gap.
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginTop: '20px',
        }}
      >
        {users.map((user) => (
          // Use global ItemCard with 'as' prop to turn it into a Link. This allows the whole card to be clickable and navigate to a specific URL.
          <ItemCard
            key={user.id}
            as={Link} // Change the underlying HTML element to 'Link'.
            to={`/users/${user.id}`} // The URL path for this specific user.
            hoverable // Enable the hover animation from GlobalStyling.
            style={{
              textDecoration: 'none', // Remove default link underline.
              color: 'inherit', // Prevent the text from turning "Link Blue".
              display: 'flex', // Use flex inside the card to space out content.
              justifyContent: 'space-between', // Pushe name to left and blog count to right
            }}
          >
            <span // ItemCard: flex/space-between - User details displayed to far left inside the card, as it is the first child.
              style={{ fontSize: '1.1em', fontWeight: 500, color: '#2c3e50' }}
            >
              {user.name}
            </span>
            <span // ItemCard: flex/space-between - Blogs created details displayed to far right inside the card, as it is the seconnd child.
              style={{ color: '#7f8c8d' }}
            >
              {user.blogs.length} blogs created
            </span>
          </ItemCard>
        ))}
      </div>
    </div>
  )
}

export default Users
