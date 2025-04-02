import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Plus, User, Settings, LogOut, Heart } from 'lucide-react';
import Notification from './Notification'; // Import the custom notification
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';

const Navbar = ({ isLoggedIn = false, isDarkMode, onThemeToggle, onLogout }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false); // State for logout notification
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchQuery);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Toggle mobile search bar
  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    onLogout(); // Call the onLogout function passed as a prop
    setShowNotification(true); // Show the custom notification
    setTimeout(() => {
      navigate('/'); // Navigate to the home page after 3 seconds
    }, 3000);
  };

  return (
    <>
      {/* Custom Notification for Logout */}
      {showNotification && (
        <Notification
          message="Logged out successfully!"
          onClose={() => setShowNotification(false)}
        />
      )}

      <nav className={`navbar navbar-expand-lg navbar-light sticky-top shadow-sm ${isDarkMode ? 'navbar-dark bg-dark' : 'bg-light'}`}>
        <div className="container-fluid">
          {/* Left Side: Website Name */}
          <Link to="/" className="navbar-brand text-primary fs-3 fw-bold" style={{ fontFamily: 'cursive', color: '#6C63FF' }}>
            BlogSphere
          </Link>

          {/* Center: Search Bar (Visible on larger screens) */}
          <div className="flex-grow-1 mx-4 d-none d-lg-block" style={{ maxWidth: '400px' }}>
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                <Search className="text-muted" style={{ width: '20px', height: '20px' }} />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control ps-5"
                style={{ borderRadius: '20px' }}
              />
            </form>
          </div>

          {/* Right Side: Buttons and Icons */}
          <div className="d-flex align-items-center gap-3">
            {/* Search Icon (Visible on mobile screens) */}
            <button
              className="btn btn-outline-secondary d-flex align-items-center d-lg-none"
              onClick={toggleMobileSearch}
              style={{ borderRadius: '50%', padding: '8px' }}
            >
              <Search className="hover-effect" style={{ width: '20px', height: '20px' }} />
            </button>

            {/* Favorites Icon */}
            <Link to="/favorites" className="btn btn-outline-secondary d-flex align-items-center" style={{ borderRadius: '50%', padding: '8px' }}>
              <Heart className="hover-effect" style={{ color: isDarkMode ? '#fff' : '#6C63FF' }} />
            </Link>

            {/* Theme Toggle */}
            <button
              aria-label="Toggle theme"
              onClick={onThemeToggle}
              className="btn btn-outline-secondary d-flex align-items-center"
              style={{ borderRadius: '50%', padding: '8px' }}
            >
              {isDarkMode ? <Sun className="hover-effect" /> : <Moon className="hover-effect" />}
            </button>

            {/* Conditional Rendering Based on Login Status */}
            {isLoggedIn ? (
              <>
                {/* Create Blog Button */}
                <Link to="/create-blog" className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: '20px' }}>
                  <Plus /> Create Blog
                </Link>

                {/* Profile Dropdown */}
                <div className="dropdown" ref={dropdownRef}>
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center"
                    onClick={toggleProfileDropdown}
                    aria-expanded={isProfileDropdownOpen}
                    aria-label="Profile dropdown"
                    style={{ borderRadius: '50%', padding: '8px' }}
                  >
                    <User className="hover-effect" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="dropdown-menu show position-absolute end-0">
                      <Link to="/profile" className="dropdown-item">
                        <User className="me-2" /> View Profile
                      </Link>
                      <Link to="/uploaded-blogs" className="dropdown-item">
                        <Plus className="me-2" /> Uploaded Blogs
                      </Link>
                      <Link to="/account-settings" className="dropdown-item">
                        <Settings className="me-2" /> Account Settings
                      </Link>
                      <button onClick={handleLogout} className="dropdown-item">
                        <LogOut className="me-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Join and Sign-in Buttons for Guest Users */}
                <Link to="/signup" className="btn btn-primary d-flex align-items-center gap-2" style={{ borderRadius: '20px' }}>
                  Join
                </Link>
                <Link to="/login" className="btn btn-outline-primary d-flex align-items-center gap-2" style={{ borderRadius: '20px' }}>
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (Visible when toggled) */}
        {isMobileSearchOpen && (
          <div className="container-fluid mt-3 d-lg-none">
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <div className="position-absolute top-50 start-0 translate-middle-y ps-3">
                <Search className="text-muted" style={{ width: '20px', height: '20px' }} />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control ps-5"
                style={{ borderRadius: '20px' }}
              />
            </form>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;