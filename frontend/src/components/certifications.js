import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";
import axios from "axios";
import "./certifications.css";


const Certifications = () => {
  const navigate = useNavigate();
  const [showSelect, setShowSelect] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [certifications, setCertifications] = useState([]);


const [filters, setFilters] = useState({
  type: "",
  search: "",
  date: ""
});
const [deleteConfirm, setDeleteConfirm] = useState({
  show: false,
  certifId: null
});
const openDeleteConfirm = (id) => {
  setDeleteConfirm({ show: true, certifId: id });
};

const closeDeleteConfirm = () => {
  setDeleteConfirm({ show: false, certifId: null });
};

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    document.title = "Certifications";
    document.body.style.backgroundColor = "white";

    axios.get("http://localhost:3001/certifications/all")
      .then(res => setCertifications(res.data))
      .catch(err => console.error("Erreur lors du chargement des certifications :", err));
  }, []);

  // Filtrer les certifications selon les filtres
const filteredCertifications = certifications.filter(certif => {
  const matchesType = filters.type === "" ||
    (filters.type === "participant" && certif.nomPrenomPart) ||
    (filters.type === "entreprise" && !certif.nomPrenomPart);

  const searchLower = filters.search.toLowerCase();

  const matchesNomOrTheme = certif.nomSociete.toLowerCase().includes(searchLower) ||
                            certif.theme.toLowerCase().includes(searchLower);

  const matchesDate = filters.date === "" || certif.datedebut === filters.date || certif.datefin === filters.date;

  return matchesType && matchesNomOrTheme && matchesDate;
});



  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
const handleDelete = async () => {
  if (!deleteConfirm.certifId) return; // ignore si id null ou undefined

  try {
    await axios.delete(`http://localhost:3001/certifications/${deleteConfirm.certifId}`);
    setCertifications(prev => prev.filter(certif => certif._id !== deleteConfirm.certifId));
    closeDeleteConfirm();
    console.log("Certification supprimée :", deleteConfirm.certifId);
  } catch (err) {
    console.error("Erreur suppression certification :", err);
  }
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
          className="btn-ajouter"
          onClick={() => setShowSelect(true)}
        >
          Ajouter certifications
        </button>

{showSelect && (
  <div className="select-container">
    <label htmlFor="addType">Choisissez le type de certification</label>
    <select
      id="addType"
      onChange={(e) => {
        const value = e.target.value;
        if (value === "entreprise") {
          navigate("/addCertificationEntreprise");
        } else if (value === "participant") {
          navigate("/addCertificationParticipant");
        }
      }}
      defaultValue=""
    >
      <option value="" disabled>Sélectionnez un type</option>
      <option value="entreprise">Pour entreprise</option>
      <option value="participant">Pour participant</option>
    </select>
    <button
      className="button-annuler"
      onClick={() => setShowSelect(false)}
    >
      Annuler
    </button>
  </div>
)}
    {deleteConfirm.show && (
  <div className="confirm-overlay">
    <div className="confirm-box">
      <p>Confirmer la suppression de cette certification ?</p>
      <div className="confirm-buttons">
        <button onClick={handleDelete}>Confirmer</button>
        <button onClick={closeDeleteConfirm}>Annuler</button>
      </div>
    </div>
  </div>
)}


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
            name="search"
            placeholder="Nom ou Thème"
            value={filters.search}
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
              <th>Numéro</th>
              <th>Thème</th>
              <th>Nom</th>
              <th>Durée</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
<tbody>
  {filteredCertifications.length > 0 ? (
    filteredCertifications.map(certif => (
      <tr key={certif._id}>
        <td>{certif.numero}</td> {/* numéro unique */}
        <td>{certif.theme}</td>
        <td>{certif.nomSociete}</td>
        <td>{certif.duree} jours</td>
        <td>
          {new Date(certif.datedebut).toLocaleDateString('fr-FR')} - {new Date(certif.datefin).toLocaleDateString('fr-FR')}
        </td>
        <td>
          <button onClick={() => navigate(`/certifprint/${certif._id}`)}>🖨️</button>
          <button onClick={() => navigate(`/updateCertif/${certif._id}`)}>✏️</button>
          <button onClick={() => openDeleteConfirm(certif._id)}>🗑️</button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5">Aucune certification trouvée</td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </>
  );
};

export default Certifications;
