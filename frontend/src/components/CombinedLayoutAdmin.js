// CombinedLayoutAdmin.js
import React, { useState, useEffect, useRef } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./combinedLayoutAdmin.css";

const CombinedLayoutAdmin = ({ isSidebarOpen, toggleSidebar, children }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="layout-container">
      <nav className="navbar">
        <div className="navbar-left">
          <i className="bi bi-list toggle-btn" onClick={toggleSidebar}></i>
          <span>CPFMI</span>
        </div>

        <div className="navbar-right">
          <i className="bi bi-bell"></i>
          <div className="profile-container" ref={menuRef}>
            <i className="bi bi-person-circle" onClick={toggleProfileMenu}></i>
            {showProfileMenu && (
              <div className="profile-menu">
                <p><i className="bi bi-person"></i> Profil</p>
                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => (window.location.href = "/")}
                >
                  <i className="bi bi-box-arrow-right"></i> Logout
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li><i className="bi bi-speedometer2"></i><span>Dashboard</span></li>
          <li><i className="bi bi-buildings"></i><span>Clients</span></li>
          <li><i className="bi bi-building-gear"></i><span>Entreprises</span></li>
          <li><i className="bi bi-person"></i><span>Formateurs</span></li>
          <li><i className="bi bi-info-circle"></i><span>Formations</span></li>
          <li><i className="bi bi-award"></i><span>Certifications</span></li>
        </ul>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default CombinedLayoutAdmin;
