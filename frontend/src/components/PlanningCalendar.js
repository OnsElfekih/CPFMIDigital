import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin"; // adapte le chemin

// Palette de couleurs pour les formateurs
const formateurColors = [
  "#FF6B6B",
  "#6BCB77",
  "#4D96FF",
  "#FFD93D",
  "#845EC2",
  "#00C9A7",
  "#FF9671",
];

export default function CalendarPlanning() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 🔹 Récupérer toutes les disponibilités
  useEffect(() => {
    const fetchDisponibilites = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/api/disponibilites/all"
        );

        const eventsData = res.data.map((d, index) => {
          const start = new Date(d.start);
          const end = new Date(d.end);

          const color =
            formateurColors[
              index % formateurColors.length
            ]; // choisir une couleur par dispo

          return {
            id: d.id,
            title: `Disponible: ${d.extendedProps.formateur}`,
            start,
            end,
            backgroundColor: color,
            borderColor: color,
            textColor: "#fff",
            extendedProps: {
              formateur: d.extendedProps.formateur,
              periode: d.extendedProps.periode,
              formation: d.extendedProps.formation || "Libre",
            },
          };
        });

        setEvents(eventsData);
      } catch (err) {
        console.error("Erreur lors du chargement des disponibilités :", err);
      }
    };

    fetchDisponibilites();
  }, []);

  // 🔹 Cliquer sur un événement
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
  };

  return (
    <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <div style={{ paddingTop: "90px", paddingLeft: "20px", paddingRight: "20px" }}>
        <h2
        style={{
          marginBottom: "30px",
          color: "#0367A6",
          fontWeight: "700",
          fontSize: "36px",          // taille plus grande
          textAlign: "center",       // centrer le titre
          fontFamily: "'Poppins', sans-serif", // optionnel, pour un style plus moderne
        }}
      >
        Planning des Formateurs
      </h2>


        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          eventClick={handleEventClick}
          height="auto"
          locale="fr"
          eventDisplay="block"
          dayMaxEvents={3}
          eventBorderColor="#fff"
          eventTextColor="#fff"
          eventClassNames="rounded-lg shadow-md"
        />

        {selectedEvent && (
          <div
            style={{
              marginTop: 30,
              padding: 25,
              border: "1px solid #ddd",
              borderRadius: "15px",
              backgroundColor: "#f0f8ff",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              maxWidth: "500px",
            }}
          >
            <h3 style={{ marginBottom: 15, color: "#0367A6" }}>Détails de la Disponibilité</h3>
            <p>
              <strong>Formateur :</strong>{" "}
              {selectedEvent.extendedProps.formateur}
            </p>
            <p>
              <strong>Période :</strong> {selectedEvent.extendedProps.periode}
            </p>
            <p>
              <strong>Formation :</strong>{" "}
              {selectedEvent.extendedProps.formation}
            </p>
            <p>
              <strong>Date de début :</strong>{" "}
              {selectedEvent.start.toLocaleString()}
            </p>
            <p>
              <strong>Date de fin :</strong>{" "}
              {selectedEvent.end ? selectedEvent.end.toLocaleString() : "Non spécifiée"}
            </p>
          </div>
        )}
      </div>
    </CombinedLayoutAdmin>
  );
}
