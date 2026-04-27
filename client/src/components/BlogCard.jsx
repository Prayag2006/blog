import { Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const defaultImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

  return (
    <div className="blog-card">
      <img 
        src={post.image_url || defaultImage} 
        alt={post.title} 
        className="card-image"
        onError={(e) => { e.target.src = defaultImage; }}
      />
      <div className="card-content">
        <h3 className="card-title">
          <Link to={`/post/${post.id}`}>{post.title}</Link>
        </h3>
        <div className="card-excerpt">
          {post.content.length > 120 ? `${post.content.substring(0, 120)}...` : post.content}
        </div>
        <div className="card-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <User size={14} />
            <span>{post.author_name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={14} />
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
