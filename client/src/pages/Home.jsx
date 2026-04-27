import { useState, useEffect } from 'react';
import BlogCard from '../components/BlogCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/posts');
        if (!res.ok) throw new Error('Failed to fetch posts');
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="loader"></div>;
  
  if (error) return (
    <div className="text-center mt-4">
      <div className="error-message">{error}</div>
      <p className="text-secondary">Please ensure the backend server is running on port 5000.</p>
    </div>
  );

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '1rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Discover Latest Insights
        </h1>
        <p className="text-secondary" style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
          Explore articles on technology, design, and development from our community of creators.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center text-secondary mt-4">
          <p>No posts found. Be the first to create one!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
