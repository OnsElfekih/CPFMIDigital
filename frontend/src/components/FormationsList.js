import React, { useState, useEffect } from "react";
import CombinedLayoutEntreprise from "./combinedLayoutEntreprise";
import UploadParticipants from "./UploadParticipants"; // le composant d'import

const FormationsList = () => {
  const [formations, setFormations] = useState([]);
  const [filters, setFilters] = useState({
    formateur: "",
    theme: "",
    dateDebut: "",
    dateFin: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [selectedFormation, setSelectedFormation] = useState(null); // formation choisie
  const clientId = localStorage.getItem("clientId"); // récupéré depuis login

  // Fetch formations avec filtres
  const fetchFormations = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:3001/api/formations?${query}`);
      if (!res.ok) throw new Error("Erreur lors de la récupération des formations");
      const data = await res.json();
      setFormations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  // Handle changement des filtres
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

const handleApplyFilters = () => {
  const query = new URLSearchParams();

  if (filters.formateur) query.append("formateur", filters.formateur);
  if (filters.theme) query.append("theme", filters.theme);
  if (filters.dateDebut)
    query.append("dateDebut", new Date(filters.dateDebut + "T00:00:00.000Z").toISOString());
  if (filters.dateFin)
    query.append("dateFin", new Date(filters.dateFin + "T23:59:59.999Z").toISOString());

  fetch(`http://localhost:3001/api/formations?${query.toString()}`)
    .then(res => res.json())
    .then(setFormations)
    .catch(console.error);
};


  // Télécharger CSV
  const handleDownloadCSV = () => {
    const query = new URLSearchParams(filters).toString();
    window.open(`http://localhost:3001/api/formations/export/csv?${query}`, "_blank");
  };

  // Imprimer la liste
  const handlePrint = () => {
    const printContent = document.getElementById("formations-table").outerHTML;
    const newWin = window.open("");
    newWin.document.write("<html><head><title>Formations</title></head><body>");
    newWin.document.write(printContent);
    newWin.document.write("</body></html>");
    newWin.document.close();
    newWin.print();
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <CombinedLayoutEntreprise
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Contenu principal */}
    <main
  style={{
    flex: 1,
    padding: "20px",
    marginLeft: isSidebarOpen ? "250px" : "80px", // ← ici on garde un espace même si sidebar fermée
    transition: "margin-left 0.3s",
  }}
>
        <h2>Formations programmées</h2>

        {/* Filtres */}
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Formateur"
            name="formateur"
            value={filters.formateur}
            onChange={handleFilterChange}
            style={{ marginRight: "10px" }}
          />
          <input
            type="text"
            placeholder="Thème"
            name="theme"
            value={filters.theme}
            onChange={handleFilterChange}
            style={{ marginRight: "10px" }}
          />
         
         
          <button onClick={handleApplyFilters}>Appliquer filtres</button>
        </div>

        {/* Boutons download / print */}
        <div style={{ marginBottom: "20px" }}>
          <button onClick={handleDownloadCSV} style={{ marginRight: "10px" }}>
            Télécharger CSV
          </button>
          <button onClick={handlePrint}>Imprimer</button>
        </div>

        {/* Tableau des formations */}
        <table
          id="formations-table"
          border="1"
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Titre</th>
              <th>Formateur</th>
              <th>Thème</th>
              <th>Date début</th>
              <th>Date fin</th>
              <th>Lieu</th>
              <th>Participants</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {formations.length > 0 ? (
              formations.map((f) => (
                <tr key={f._id}>
                  <td>{f.titre}</td>
                  <td>{f.formateur}</td>
                  <td>{f.theme}</td>
                  <td>{new Date(f.dateDebut).toLocaleDateString()}</td>
                  <td>{new Date(f.dateFin).toLocaleDateString()}</td>
                  <td>{f.lieu}</td>
                  <td>{f.participants}</td>
                  <td>{f.statut}</td>
                  <td>
                    <button onClick={() => setSelectedFormation(f)}>
                      Importer participants
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>
                  Aucune formation trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Modale Import Participants */}
        {selectedFormation && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
              <UploadParticipants
                titreFormation={selectedFormation.titre}
                formateur={selectedFormation.formateur}
                
                onClose={() => setSelectedFormation(null)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FormationsList;
