import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin"; // adapte le chemin

export default function CalendarPlanning() {
  const [formateurs, setFormateurs] = useState([]);
  const [selectedFormateur, setSelectedFormateur] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    axios.get("http://localhost:3001/api/formateurs")
      .then(res => setFormateurs(res.data))
      .catch(err => console.error("Erreur lors du chargement des formateurs :", err));
  }, []);

  useEffect(() => {
    if (selectedFormateur) {
      axios.get(`http://localhost:3001/api/planning/${selectedFormateur}`)
        .then(res => {
          const mappedEvents = res.data.map(planning => ({
            id: planning._id,
            title: planning.formation,
            start: planning.dateDebut,
            end: planning.dateFin,
            extendedProps: {
              description: planning.description || "Aucun détail fourni",
              lieu: planning.lieu || "Non spécifié",
              type: planning.type || "Formation",
            }
          }));
          setEvents(mappedEvents);
        })
        .catch(err => console.error("Erreur lors du chargement du planning :", err));
    } else {
      setEvents([]);
    }
  }, [selectedFormateur]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  return (
    <>
      <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`} style={{ paddingTop: "90px" }}>
        <h2 style={{ marginBottom: "20px", color: "#0367A6" }}>Planning des Formations</h2>

        <select
          value={selectedFormateur}
          onChange={(e) => {
            setSelectedFormateur(e.target.value);
            setSelectedEvent(null);
          }}
          style={{
            padding: "10px",
            marginBottom: "20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "1px solid #ccc"
          }}
        >
          <option value="">-- Sélectionner un formateur --</option>
          {formateurs.map((f) => (
            <option key={f._id} value={f._id}>
              {f.nom} {f.prenom}
            </option>
          ))}
        </select>

        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          locale="fr"
        />

        {selectedEvent && (
          <div style={{
            marginTop: 30,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: "10px",
            backgroundColor: "#f9f9f9"
          }}>
            <h3>Détails de la Formation</h3>
            <p><strong>Formation :</strong> {selectedEvent.title}</p>
            <p><strong>Date de début :</strong> {selectedEvent.start.toLocaleDateString()}</p>
            <p><strong>Date de fin :</strong> {selectedEvent.end ? selectedEvent.end.toLocaleDateString() : "Non spécifiée"}</p>
            <p><strong>Description :</strong> {selectedEvent.extendedProps.description}</p>
            <p><strong>Lieu :</strong> {selectedEvent.extendedProps.lieu}</p>
            <p><strong>Type :</strong> {selectedEvent.extendedProps.type}</p>
          </div>
        )}
      </div>
    </>
  );
}
