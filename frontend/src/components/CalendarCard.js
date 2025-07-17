import React from 'react';

const CalendarCard = ({ item }) => {
  return (
    <div style={{
      border: '1px solid #ccc',
      padding: '16px',
      borderRadius: '8px',
      marginBottom: '10px'
    }}>
      <h3>{item.formationTitle}</h3>
      <p><strong>Formateur:</strong> {item.formateurId.username}</p>
      <p><strong>Date:</strong> {new Date(item.dateDebut).toLocaleDateString()} - {new Date(item.dateFin).toLocaleDateString()}</p>
      <p><strong>Lieu:</strong> {item.lieu}</p>
    </div>
  );
};

export default CalendarCard;
