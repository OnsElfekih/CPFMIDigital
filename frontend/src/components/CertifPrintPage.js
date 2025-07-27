import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CertificatPrint from "./certifPrint";
import "./certifprintpage.css";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";

const CertifPrintPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const { id } = useParams();
  const navigate = useNavigate();
  const [certif, setCertif] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3001/certifications/${id}`)
      .then(res => setCertif(res.data))
      .catch(() => setError("Erreur lors du chargement de la certification"));
  }, [id]);

  return (
    <>
      <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px",
          padding: "10px",
          transition: "margin-left 0.3s ease",
          width: "100%"
        }}
      >
          {error && <div className="error">{error}</div>}
          {!certif && !error && <div className="loading">Chargement...</div>}
          {certif && <CertificatPrint certif={certif} onClose={() => navigate(-1)} />}
        </div>
    </>
  );
};

export default CertifPrintPage;
