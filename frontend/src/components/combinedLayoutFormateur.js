import React, { useState, useEffect, useRef } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "./combinedLayoutFormateur.css";

const CombinedLayoutFormateur = ({ isSidebarOpen, toggleSidebar, children }) => {
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* NAVBAR */}
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
                <p onClick={() => (window.location.href = "/updateform")}>
                  <i className="bi bi-person"></i> Profil
                </p>
                <p onClick={() => (window.location.href = "/")}>
                  <i className="bi bi-box-arrow-right"></i> Logout
                </p>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <ul>
          <li onClick={() => (window.location.href = "/formations")}>
            <i className="bi bi-info-circle"></i>
            <span>Formations</span>
          </li>
          <li onClick={() => (window.location.href = "/certifications")}>
            <i className="bi bi-award"></i>
            <span>Certifications</span>
          </li>
          <li onClick={() => (window.location.href = "/calendrier")}>
            <i className="bi bi-calendar"></i>
            <span>Calendrier</span>
          </li>
        </ul>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <main
        className="main-content"
        style={{
          marginLeft: isSidebarOpen ? 200 : 80,
          marginTop: 60,
          padding: "20px",
        }}
      >
        {children}
      </main>
    </>
  );
};

export default CombinedLayoutFormateur;
