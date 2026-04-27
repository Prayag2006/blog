const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDbConnection } = require('./database');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_super_secret_jwt_key_here'; // In production, use env variables

app.use(cors());
app.use(express.json());

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = await getDbConnection();
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    // Generate token for immediate login
    const token = jwt.sign({ id: result.lastID, username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: result.lastID, username } });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const db = await getDbConnection();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) return res.status(400).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// --- BLOG POST ROUTES ---
// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const db = await getDbConnection();
    const posts = await db.all(`
      SELECT posts.*, users.username as author_name 
      FROM posts 
      JOIN users ON posts.author_id = users.id 
      ORDER BY posts.created_at DESC
    `);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const db = await getDbConnection();
    const post = await db.get(`
      SELECT posts.*, users.username as author_name 
      FROM posts 
      JOIN users ON posts.author_id = users.id 
      WHERE posts.id = ?
    `, [req.params.id]);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create post
app.post('/api/posts', authenticateToken, async (req, res) => {
  const { title, content, image_url } = req.body;
  try {
    const db = await getDbConnection();
    const result = await db.run(
      'INSERT INTO posts (title, content, image_url, author_id) VALUES (?, ?, ?, ?)',
      [title, content, image_url, req.user.id]
    );
    res.json({ id: result.lastID, title, content, image_url, author_id: req.user.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  const { title, content, image_url } = req.body;
  try {
    const db = await getDbConnection();
    // Verify ownership
    const post = await db.get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized to edit this post' });

    await db.run(
      'UPDATE posts SET title = ?, content = ?, image_url = ? WHERE id = ?',
      [title, content, image_url, req.params.id]
    );
    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDbConnection();
    // Verify ownership
    const post = await db.get('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.author_id !== req.user.id) return res.status(403).json({ error: 'Unauthorized to delete this post' });

    await db.run('DELETE FROM posts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
