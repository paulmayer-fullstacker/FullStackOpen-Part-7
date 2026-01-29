// src/components/Blog.jsx:
// Presentational Component: take data (blog) and display it using the styled components and routing logic. THis is one blog in a list of blogs.
import { Link } from 'react-router-dom' // Import Link component from react-router-dom to enable client-side navigation without refreshing the page.
import { ItemCard } from './GlobalStyling' // Import ItemCard from GlobalStyling.
// Define Blog: a functional component that receives a 'blog' object as a prop via destructuring.
const Blog = ({ blog }) => {
  return (
    // Render the ItemCard wrapper. 'hoverable' boolean prop to trigger hover effects.
    <ItemCard hoverable className="blog-item">
      {/* Wrap the blog title in a Link. Clicking this will change the URL to /blogs/ID,  triggering the Route defined in App.jsx. */}
      <Link
        // The 'to' prop uses a template literal to dynamically create a path (e.g., /blogs/123) based on the blog's unique ID.
        to={`/blogs/${blog.id}`}
        style={{
          textDecoration: 'none', // Removes the default blue underline from the link.
          color: '#2c3e50', // Sets colour for the text.
          fontWeight: 500, // Sets the font weight to medium.
          fontSize: '1.1em', // Scales the font size slightly larger than the parent element.
        }}
      >
        {/* Access the 'title' property of the blog object to display the text of the ItemCard/Link. */}
        {blog.title}
      </Link>
    </ItemCard>
  )
}

export default Blog
