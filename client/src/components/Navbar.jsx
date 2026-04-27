import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, LogOut, PenTool, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <BookOpen style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
        Bloging
      </Link>
      
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        
        {user ? (
          <>
            <Link to="/create" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>
              <PenTool size={16} /> Write
            </Link>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: '500' }}>
              <User size={18} />
              <span>Admin Panel</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
