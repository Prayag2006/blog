import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/posts');
      if (!res.ok) throw new Error('Failed to fetch posts');
      const data = await res.json();
      
      // Admin Panel: Filter posts to show only those belonging to the logged-in user
      const userPosts = data.filter(post => post.author_id === user.id);
      setPosts(userPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) throw new Error('Failed to delete post');
      // Remove deleted post from state immediately
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loader"></div>;

  return (
    <div className="admin-panel" style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem 0' }}>
      <div className="admin-header">
        <h2 style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>Admin Panel</h2>
        <Link to="/create" className="btn btn-primary">
          <PlusCircle size={18} /> Create New Post
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-content" style={{ background: 'var(--bg-surface)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
        {posts.length === 0 ? (
          <div className="text-center" style={{ padding: '4rem 2rem' }}>
            <p className="text-secondary" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>You haven't written any posts yet.</p>
            <Link to="/create" className="btn btn-primary">Write your first post</Link>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date Created</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <Link to={`/post/${post.id}`} style={{ fontWeight: '600', fontSize: '1.05rem' }}>{post.title}</Link>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="admin-actions">
                        <Link to={`/edit/${post.id}`} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                          <Edit size={14} /> Edit
                        </Link>
                        <button onClick={() => handleDelete(post.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
