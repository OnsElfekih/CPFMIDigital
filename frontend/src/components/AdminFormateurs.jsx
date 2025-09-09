// pages/AdminFormateurs.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  IconButton,
  CircularProgress,
  InputAdornment,
  Avatar,
  Tooltip,
} from "@mui/material";
import { Edit, Delete, Search } from "@mui/icons-material";
import Cookies from "js-cookie";
import CombinedLayoutAdmin from "../components/CombinedLayoutAdmin";

const AdminFormateurs = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const token = Cookies.get("token");

  const fetchFormateurs = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/formateurs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormateurs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormateurs();
  }, []);

  const handleOpen = (formateur = null) => {
    if (formateur) {
      setEditId(formateur._id);
      setFormData(formateur);
    } else {
      setEditId(null);
      setFormData({});
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(
          `http://localhost:3001/api/formateurs/${editId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `http://localhost:3001/api/formateurs/add`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchFormateurs();
      handleClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment archiver ce formateur ?")) {
      try {
        await axios.delete(`http://localhost:3001/api/formateurs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchFormateurs();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // 🔍 filtrage dynamique
  const filteredFormateurs = formateurs.filter((f) =>
    `${f.prenom} ${f.nom} ${f.email} ${f.specialite} ${f.domaine}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <CombinedLayoutAdmin
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
    >
      <Box
        p={4}
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        minHeight="100vh"
        sx={{ backgroundColor: "#f4f6f9" }}
      >
        <Box maxWidth="1200px" width="100%">
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h4" fontWeight="bold" color="primary">
              👨‍🏫 Gestion des Formateurs
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: 3, px: 3, py: 1 }}
              onClick={() => handleOpen()}
            >
              + Ajouter
            </Button>
          </Box>

          {/* Barre de recherche */}
          <Box mb={4}>
            <TextField
              fullWidth
              placeholder=" Rechercher par nom, email, spécialité..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "#fff",
                borderRadius: 3,
                boxShadow: 1,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Loader */}
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredFormateurs.length === 0 ? (
                <Typography>Aucun formateur trouvé.</Typography>
              ) : (
                filteredFormateurs.map((f) => (
                  <Grid item xs={12} sm={6} md={4} key={f._id}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        boxShadow: 4,
                        transition: "0.3s",
                        background:
                          "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
                        "&:hover": { transform: "translateY(-5px)", boxShadow: 8 },
                      }}
                    >
                      <CardContent>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar
                            sx={{
                              bgcolor: "#3f51b5",
                              color: "#fff",
                              mr: 2,
                              width: 48,
                              height: 48,
                              fontSize: 18,
                            }}
                          >
                            {f.prenom?.[0]}
                            {f.nom?.[0]}
                          </Avatar>
                          <Typography variant="h6" fontWeight="bold">
                            {f.prenom} {f.nom}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          📧 {f.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          🎓 Diplôme : {f.diplome}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          🛠️ {f.specialite} - {f.domaine}
                        </Typography>
                      </CardContent>
                      <CardActions sx={{ justifyContent: "flex-end" }}>
                        <Tooltip title="Modifier">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpen(f)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(f._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          )}

          {/* Dialog */}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle
              sx={{
                fontWeight: "bold",
                color: "primary.main",
                textAlign: "center",
              }}
            >
              {editId ? "✏️ Modifier Formateur" : "➕ Ajouter Formateur"}
            </DialogTitle>
            <DialogContent dividers>
              {[
                { label: "Nom", field: "nom" },
                { label: "Prénom", field: "prenom" },
                { label: "Email", field: "email" },
                { label: "Spécialité", field: "specialite" },
                { label: "Domaine", field: "domaine" },
                { label: "Diplôme", field: "diplome" },
                { label: "Planning", field: "planning" },
              ].map(({ label, field }) => (
                <TextField
                  key={field}
                  fullWidth
                  label={label}
                  value={formData[field] || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  margin="dense"
                  sx={{ mb: 2 }}
                />
              ))}
              {!editId && (
                <TextField
                  fullWidth
                  label="Mot de passe"
                  type="password"
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  margin="dense"
                  sx={{ mb: 2 }}
                />
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button onClick={handleClose} color="inherit">
                Annuler
              </Button>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                sx={{ borderRadius: 3, px: 3 }}
              >
                {editId ? "Modifier" : "Ajouter"}
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </CombinedLayoutAdmin>
  );
};

export default AdminFormateurs;
