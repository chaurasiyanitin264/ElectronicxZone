import React, { useState, useEffect } from "react";
import "../admin/AdminDashboard.css";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();
  
  // Close menu automatically on mobile when navigating
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    };
    
    // Set initial state based on screen size
    handleResize();
    
    // Add event listener
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Close menu on mobile when navigating to a new page
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setMenuOpen(false);
    }
  }, [location.pathname]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <button 
          className="hamburger-menu" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <h2 className="dashboard-title">Admin Dashboard</h2>
      </div>
      
      <div className="admin-container">
        <div className={`admin-menu ${menuOpen ? 'menu-open' : 'menu-closed'}`}>
          <h3 className="menu-title">Admin Menu</h3>
          <div className="menu-links">
            <Link to="#" className="menu-link">
              <span className="menu-icon">🏠</span>
              <span className="menu-text">Home</span>
            </Link>
            <Link to="insertpro" className="menu-link">
              <span className="menu-icon">➕</span>
              <span className="menu-text">Insert Product</span>
            </Link>
            <Link to="viewpro" className="menu-link">
              <span className="menu-icon">📋</span>
              <span className="menu-text">View Products</span>
            </Link>
            <Link to="orders" className="menu-link">
              <span className="menu-icon">📦</span>
              <span className="menu-text">View Orders</span>
            </Link>
            <Link to="/" className="menu-link logout-link">
              <span className="menu-icon">🚪</span>
              <span className="menu-text">LOGOUT</span>
            </Link>
          </div>
        </div>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
      
      {/* Mobile overlay to close menu when clicking outside */}
      {menuOpen && window.innerWidth <= 768 && (
        <div className="menu-overlay" onClick={toggleMenu}></div>
      )}
    </div>
  );
};

export default AdminDashboard;