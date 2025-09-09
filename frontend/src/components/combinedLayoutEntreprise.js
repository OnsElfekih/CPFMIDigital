import React, { useState, useEffect, useRef } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./combinedLayoutEntreprise.css";

const CombinedLayoutEntreprise = ({ isSidebarOpen, toggleSidebar, children }) => {
  const [username, setUsername] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleProfileMenu = () => setShowProfileMenu(!showProfileMenu);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="layout-container" style={{ display: "flex" }}>
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li style={{ cursor: "pointer" }} onClick={() => (window.location.href = "/historiqueeval")}>
            <i className="bi bi-info-circle"></i>
            <span>Formations</span>
          </li>
          <li style={{ cursor: "pointer" }} onClick={() => (window.location.href = "/listeformateur")}>
            <i className="bi bi-person"></i>
            <span>Formateurs</span>
          </li>
          <li>
            <i className="bi bi-award"></i>
            <span>Certifications</span>
          </li>
          <li>
            <i className="bi bi-calendar"></i>
            <span>Calendrier</span>
          </li>
        </ul>
      </aside>

      <div className="main-content" style={{ flexGrow: 1, transition: "margin-left 0.3s" }}>
        <nav className="navbar">
          <div className="navbar-left">
            <i className="bi bi-list toggle-btn" onClick={toggleSidebar}></i>
            <span>Bonjour {username}</span>
          </div>

          <div className="navbar-right">
            <div className="profile-container" ref={menuRef}>
              <i className="bi bi-person-circle" onClick={toggleProfileMenu}></i>
              {showProfileMenu && (
                <div className="profile-menu">
                  <p style={{ cursor: "pointer" }} onClick={() => (window.location.href = "/updateClient")}>
                    <i className="bi bi-person"></i> Profil
                  </p>
                  <p style={{ cursor: "pointer" }} onClick={() => (window.location.href = "/")}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </p>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Contenu dynamique */}
        {children}
      </div>
    </div>
  );
};

export default CombinedLayoutEntreprise;
