// FacturesClient.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import CombinedLayoutEntreprise from "./combinedLayoutEntreprise"; // adapte le chemin si nécessaire
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

export default function FacturesClient() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = Cookies.get("token");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/factures/mes-factures", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFactures(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownload = async (numero) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/factures/pdf/${numero}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `facture_${numero}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur lors du téléchargement :", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "payé":
      case "payee":
        return "success";
      case "en attente":
        return "warning";
      case "annulé":
        return "error";
      default:
        return "success";
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <CombinedLayoutEntreprise isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <Box
        p={4}
        bgcolor="#f5f5f5"
        minHeight="100vh"
        sx={{ marginLeft: isSidebarOpen ? "250px" : "60px", transition: "margin-left 0.3s" }}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold" color="#333">
          Mes Factures
        </Typography>

        {factures.length === 0 ? (
          <Typography>Aucune facture trouvée</Typography>
        ) : (
          <Grid container spacing={4}>
            {factures.map((facture) => (
              <Grid item xs={12} sm={6} md={4} key={facture._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-5px)",
                      boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        Facture n° {facture.numero}
                      </Typography>
                      <Chip label={facture.statut} color={getStatusColor(facture.statut)} />
                    </Box>

                    <Typography mb={1}>
                      <strong>Montant:</strong> {facture.montant} €
                    </Typography>
                    <Typography mb={2}>
                      <strong>Date:</strong> {new Date(facture.date).toLocaleDateString()}
                    </Typography>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(facture.numero)}
                      sx={{ borderRadius: 2, textTransform: "none" }}
                    >
                      Télécharger
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </CombinedLayoutEntreprise>
  );
}
