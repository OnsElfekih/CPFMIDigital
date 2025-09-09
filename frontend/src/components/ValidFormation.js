import React, { useState, useEffect } from 'react';  
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  Paper
} from '@mui/material';
import { 
  CheckCircle as ValidateIcon, 
  Cancel as CancelIcon,
  Event as DateIcon,
  Class as SessionIcon
} from '@mui/icons-material';

const ValidFormation = () => {
  const [formations, setFormations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/formations');
        setFormations(res.data);
      } catch (err) {
        setError("Erreur de chargement des données");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 const updateStatus = async (id, action) => {
  try {
    // Mise à jour optimiste
    const newStatus = action === 'validate' ? 'validée' : 'annulée';
    setFormations(prev => prev.map(f => 
      f._id === id ? { ...f, statut: newStatus } : f
    ));

    // Utilisez la route /validate comme dans votre backend
    const response = await axios.put(
      `http://localhost:3001/api/formations/${id}/validate`,
      { action }, // Corps attendu par le backend
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.status !== 200) {
      throw new Error('Échec de la mise à jour');
    }
  } catch (err) {
    // Revert en cas d'erreur
    setFormations(prev => prev.map(f => 
      f._id === id ? { 
        ...f, 
        statut: formations.find(item => item._id === id).statut 
      } : f
    ));
    
    console.error("Erreur détaillée:", {
      message: err.message,
      response: err.response?.data,
      config: err.config
    });
    
    setError(`Échec de la mise à jour: ${err.response?.data?.message || err.message}`);
  }
};

  return (
    <div className="admin-home">
      <CombinedLayoutAdmin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <Box sx={{ 
          p:9,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
          minHeight: '100vh'
        }}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              mb:5,
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Validation des Sessions de Formation
          </Typography>
          
          <Stack spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
            {formations.map((formation) => (
              <Paper 
                key={formation._id}
                elevation={3}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  borderLeft: `6px solid ${
                    formation.statut === 'validée' ? '#4caf50' :
                    formation.statut === 'annulée' ? '#f44336' : '#ff9800'
                  }`,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)'
                  }
                }}
              >
                <Card sx={{ 
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <CardContent>
                    <Box sx={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Avatar sx={{ 
                          bgcolor: 'primary.main', 
                          mr: 2,
                          width: 40,
                          height: 40
                        }}>
                          {formation.titre.charAt(0)}
                        </Avatar>
                        {formation.titre}
                      </Typography>
                      
                      <Chip
                        label={formation.statut}
                        color={
                          formation.statut === 'validée' ? 'success' :
                          formation.statut === 'annulée' ? 'error' : 'warning'
                        }
                        sx={{ 
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          px: 1,
                          py: 0.5
                        }} 
                      />
                    </Box>
                    
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      flexWrap: 'wrap'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
                        <SessionIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          #{formation.idSession}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DateIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="body2">
                          {new Date(formation.dateDebut).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {formation.statut === 'en attente' && (
                      <Box sx={{ 
                        display: 'flex',
                        justifyContent: 'flex-end',
                        pt: 2,
                        borderTop: '1px solid rgba(0, 0, 0, 0.1)'
                      }}>
                        <Tooltip title="Valider la formation">
                          <IconButton 
                            onClick={() => updateStatus(formation._id, 'validate')}
                            size="large"
                            sx={{ 
                              color: '#4caf50',
                              '&:hover': { 
                                background: 'rgba(76, 175, 80, 0.1)' 
                              }
                            }}
                          >
                            <ValidateIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Annuler la formation">
                          <IconButton 
                            onClick={() => updateStatus(formation._id, 'cancel')}
                            size="large"
                            sx={{ 
                              color: '#f44336',
                              '&:hover': { 
                                background: 'rgba(244, 67, 54, 0.1)' 
                              }
                            }}
                          >
                            <CancelIcon fontSize="large" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Paper>
            ))}
          </Stack>
        </Box>
      </div>
    </div>
  );
};

export default ValidFormation;