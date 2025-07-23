import { useEffect, useState } from "react";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";
import axios from "axios";
import "./certifications.css";

const Certifications = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [certifications, setCertifications] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    nom: "",
    date: ""
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    document.title = "Certifications";
    document.body.style.backgroundColor = "white";

    axios.get("http://localhost:3001/api/certifications")
      .then(res => setCertifications(res.data))
      .catch(err => console.error("Erreur lors du chargement des certifications :", err));
  }, []);

  // Filtrer les certifications selon les filtres
  const filteredCertifications = certifications.filter(certif => {
    const matchesType = certif.type.toLowerCase().includes(filters.type.toLowerCase());
    const matchesNom = certif.nom.toLowerCase().includes(filters.nom.toLowerCase());
    const matchesDate = filters.date === "" || 
      new Date(certif.date).toISOString().slice(0,10) === filters.date;
    return matchesType && matchesNom && matchesDate;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className="flex flex-col items-center justify-center"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px",
          padding: "10px",
          transition: "margin-left 0.3s ease",
          width: "100%"
        }}
      >

        <h2 className="title">L'historique des certifications</h2>

        <button
          className="button-ajouter"
          onClick={() => alert("Ajouter certification")}
        >
          Ajouter certifications
        </button>

        <div className="search-container">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="">Tous</option>
            <option value="entreprise">Entreprise</option>
            <option value="participant">Participant</option>
          </select>
          <input
            type="text"
            name="nom"
            placeholder="Nom du certification"
            value={filters.nom}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="date"
            placeholder="Recherche par date"
            value={filters.date}
            onChange={handleFilterChange}
          />
        </div>

        <table className="table-certifications">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Nom</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertifications.length > 0 ? (
              filteredCertifications.map(certif => (
                <tr key={certif._id}>
                  <td>{certif._id}</td>
                  <td>{certif.type}</td>
                  <td>{certif.nom}</td>
                  <td>{new Date(certif.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">Aucune certification trouvée</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </>
  );
};

export default Certifications;
