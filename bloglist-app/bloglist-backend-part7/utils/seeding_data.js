// utils/seeding_data.js:
// User Data
// // Passwords are provided plain here and will be hashed by the seed function.
const testUsers = [
  {
    username: 'seededauthor1',
    name: 'Seeded Author One',
    password: 'password1234',
  },
  {
    username: 'seededauthor2',
    name: 'Seeded Author Two',
    password: 'password1234',
  },
]

// Blog Data
// The 'ownerUsername' field is temporary and used by the seed script (utils/seed.js)
// to link the blog to the correct user ID before saving to the database.
const multiUserBlogs = [
  // Blogs for 'testauthor1'
  {
    title: 'Seeded Blog 1 by Seeded Author One',
    url: 'http://example.com/auth-king',
    likes: 10,
    ownerUsername: 'seededauthor1',
    comments: ['Seeded Blog 1: Great!', 'Good job Seeded Author One'],
  },
  {
    title: 'Seeded Blog 2 by Seeded Author One',
    url: 'http://example.com/mongoose-pop',
    likes: 5,
    ownerUsername: 'seededauthor1',
    comments: ['Loved Seeded Blog 2.', 'Great insight from Seeded Author One'],
  },
  // Blogs for 'testauthor2'
  {
    title: 'Seeded Blog 1 by Seeded Author Two',
    url: 'http://example.com/node-streams',
    likes: 22,
    ownerUsername: 'seededauthor2',
    comments: ['Comment 1 on Blog 1', 'Seeded Author Two?'],
  },
  {
    title: 'Seeded Blog 2 by Seeded Author Two',
    url: 'http://example.com/idempotency',
    likes: 15,
    ownerUsername: 'seededauthor2',
    comments: ['Comment on Blog 2.', 'Another comment'],
  },
  {
    title: 'Seeded Blog 3 by Seeded Author Two',
    url: 'http://example.com/supertest-guide',
    likes: 3,
    ownerUsername: 'seededauthor2',
    comments: [
      'Comment 1 on Blog 3',
      'Comment 2 on Blog 3',
      'Comment 3 on Blog 3',
    ],
  },
]

// Exports the raw data for use in both seeding and testing scripts.
module.exports = {
  testUsers,
  multiUserBlogs,
}
