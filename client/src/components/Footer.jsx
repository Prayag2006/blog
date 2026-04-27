import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="nav-brand" style={{ marginBottom: '1rem', display: 'inline-block' }}>
            <BookOpen style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
            Bloging
          </Link>
          <p className="text-secondary" style={{ maxWidth: '300px' }}>
            Sharing insights, stories, and ideas about modern web development, design, and architecture.
          </p>
        </div>
        
        <div className="footer-links-group">
          <h4 className="footer-title">Quick Links</h4>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/login" className="footer-link">Login</Link>
          <Link to="/register" className="footer-link">Sign Up</Link>
        </div>

        <div className="footer-social">
          <h4 className="footer-title">Connect</h4>
          <div className="social-icons">
            <a href="#" className="footer-link"><Twitter size={20} /></a>
            <a href="#" className="footer-link"><Github size={20} /></a>
            <a href="#" className="footer-link"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p className="text-secondary">&copy; {new Date().getFullYear()} Bloging. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
