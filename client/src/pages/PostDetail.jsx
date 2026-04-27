import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Calendar, User, Edit, Trash2, ArrowLeft } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/${id}`);
        if (!res.ok) throw new Error('Post not found');
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
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
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loader"></div>;
  if (error) return <div className="error-message text-center mt-4">{error}</div>;
  if (!post) return null;

  const isOwner = user && user.id === post.author_id;
  const defaultImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="post-detail">
      <button 
        onClick={() => navigate('/')} 
        className="btn btn-secondary" 
        style={{ marginBottom: '2rem', padding: '0.5rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ArrowLeft size={18} /> Back to Home
      </button>

      <header className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <User size={16} />
            <span>{post.author_name}</span>
          </div>
          <span>•</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={16} />
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>

        {isOwner && (
          <div className="post-actions">
            <Link to={`/edit/${post.id}`} className="btn btn-secondary">
              <Edit size={16} /> Edit Post
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </header>

      <img 
        src={post.image_url || defaultImage} 
        alt={post.title} 
        className="post-image"
        onError={(e) => { e.target.src = defaultImage; }}
      />

      <div className="post-body">
        {post.content}
      </div>
    </div>
  );
};

export default PostDetail;
