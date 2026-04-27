const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcrypt');

async function seed() {
  const db = await open({
    filename: path.join(__dirname, 'blog.db'),
    driver: sqlite3.Database
  });

  const username = 'admin_user';
  const password = 'password123';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Clear existing data
  await db.run('DELETE FROM posts');
  await db.run('DELETE FROM users');

  // Insert user
  const result = await db.run(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hashedPassword]
  );
  const authorId = result.lastID;

  // Insert posts
  const posts = [
    {
      title: 'The Future of Web Development',
      content: 'As we step into 2026, web development has shifted dramatically towards AI-assisted coding, Edge computing, and seamless WebGL experiences. Gone are the days of manually tweaking thousands of lines of CSS; today, design systems and AI pair programmers help us achieve visual excellence faster than ever. The modern web is more vibrant, dynamic, and accessible, driven by new CSS features and highly optimized JavaScript frameworks.',
      image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Mastering React Server Components',
      content: 'Server Components are reshaping how we build React applications. By executing code exclusively on the server, we can significantly reduce the JavaScript bundle size shipped to the client, while seamlessly querying databases and accessing server-side APIs. This paradigm shift introduces a new mental model for state management and data fetching, leading to highly performant and SEO-friendly applications without the complexity of traditional SSR setups.',
      image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Designing Beautiful Interfaces',
      content: 'Visual aesthetics matter. A premium interface built with glassmorphism, subtle micro-animations, and vibrant gradients can transform a simple tool into an engaging experience. Typography choices like Inter or Outfit add a modern touch, while carefully curated dark modes reduce eye strain and provide a sleek look. Designing for the web is an art of balancing performance with visual delight.',
      image_url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  for (const post of posts) {
    await db.run(
      'INSERT INTO posts (title, content, image_url, author_id) VALUES (?, ?, ?, ?)',
      [post.title, post.content, post.image_url, authorId]
    );
  }

  console.log('Database seeded successfully!');
  await db.close();
}

seed().catch(console.error);
