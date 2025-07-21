import React, { useState, useEffect } from "react";
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const FormateurPlanning = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [selectedFormateur, setSelectedFormateur] = useState("");
  const [events, setEvents] = useState([]);

  // Récupérer la liste des formateurs
  useEffect(() => {
    axios.get("http://localhost:3001/api/formateurs")
      .then((res) => {
        setFormateurs(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // Charger le planning quand on change de formateur
  useEffect(() => {
    if (selectedFormateur) {
      axios.get(`http://localhost:3001/api/planning/formateur/${selectedFormateur}`)
        .then((res) => {
          const formattedEvents = res.data.map((item) => ({
            title: item.title,
            start: item.date, // Assure-toi que c’est bien une date ISO
            description: item.lieu,
          }));
          setEvents(formattedEvents);
        })
        .catch((err) => console.error(err));
    }
  }, [selectedFormateur]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Consulter le planning d’un formateur</h2>

      <select
        value={selectedFormateur}
        onChange={(e) => setSelectedFormateur(e.target.value)}
        style={{ padding: "10px", fontSize: "16px", marginBottom: "20px" }}
      >
        <option value="">-- Sélectionner un formateur --</option>
        {formateurs.map((formateur) => (
          <option key={formateur._id} value={formateur._id}>
            {formateur.nom} {formateur.prenom}
          </option>
        ))}
      </select>

      {selectedFormateur && (
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={events}
          height={"auto"}
        />
      )}
    </div>
  );
};

export default FormateurPlanning;
