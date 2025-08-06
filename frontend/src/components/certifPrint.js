import { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import "./certifprintpage.css";

const CertificatPrint = ({ certif, onClose }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const positions = {
      participant: {
        nomSociete: [490, 215],
        theme: [450, 355],
        duree: [325, 400],
        date: [450, 400],
        nomPrenomPart: [490, 270]
      },
      entreprise: {
        nomSociete: [500, 210],
        theme: [400, 302],
        duree: [325, 353],
        date: [450, 350]
      }
    };

    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const image = new Image();
    const type = certif.nomPrenomPart ? "participant" : "entreprise";
    image.src = type === "participant" ? "/participant.jpg" : "/entreprise.jpg";

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);
      ctx.font = "24px Arial";
      ctx.fillStyle = "#000";

      const pos = positions[type];
      ctx.fillStyle = "#F27405";
      ctx.fillText(certif.nomSociete, pos.nomSociete[0], pos.nomSociete[1]);
      ctx.fillStyle = "#092cc7ff";
      ctx.fillText(certif.theme, pos.theme[0], pos.theme[1]);
      ctx.fillStyle = "black";
      ctx.fillText(`${certif.duree}`, pos.duree[0], pos.duree[1]);
      ctx.fillText(
        `${formatDate(certif.datedebut)}        ${formatDate(certif.datefin)}`,
        pos.date[0],
        pos.date[1]
      );
      ctx.fillStyle = "#03658C";
      if (type === "participant") {
        ctx.fillText(certif.nomPrenomPart, pos.nomPrenomPart[0], pos.nomPrenomPart[1]);
      }
    };
  }, [certif]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const imgData = canvas.toDataURL("image/jpeg", 1.0);
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height]
    });

    pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

    const fileName = certif.nomPrenomPart
      ? `certificat_${certif.nomPrenomPart}.pdf`
      : `certificat_${certif.nomSociete}.pdf`;

    pdf.save(fileName);
  };

  return (
    <div className="certif-container">
      <canvas ref={canvasRef}></canvas>
      <div className="button-group">
        <button className="certif-button" onClick={handleDownload}>Télécharger la certification</button>
        <button className="certif-button" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
};

export default CertificatPrint;
