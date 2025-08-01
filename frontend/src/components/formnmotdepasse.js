import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, CircularProgress } from "@mui/material";

const FormNMotDePasse = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState(null);


  useEffect(() => {
    document.title = "Regénérer mot de passe";
    document.body.style.backgroundColor = "#0367A6";
  }, []);

// FormNMotDePasse.js

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);
  setNewPassword(null);
  try {
    const response = await fetch("http://localhost:3001/users/resetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Erreur lors de la réinitialisation");

setSuccess("Récupération faite avec succès");
setNewPassword(data.newPassword);

// Sauvegarder dans localStorage pour Remember Me
localStorage.setItem("savedEmail", email);
localStorage.setItem("savedPassword", data.newPassword);

setTimeout(() => {
  navigate("/", {
    state: {
      email: email,
      newPassword: data.newPassword
    }
  });
}, 2000);


  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 8,
        p: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box sx={{ flex: 1, mr: 2 }}>
        <Typography variant="h5" mb={2} align="center">
          Regénérer mot de passe
        </Typography>

        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="green">{success}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          {newPassword && (
            <Box mt={2} p={2} sx={{ backgroundColor: "#f0f0f0", borderRadius: 1 }}>
              <Typography variant="body1" align="center">
                Votre nouveau mot de passe est : <strong style={{ color: "#F27405" }}>{newPassword}</strong>
              </Typography>
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#F27405",
              "&:hover": {
                backgroundColor: "#F27405",
              },
            }}
            disabled={loading || !email}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Nouveau mot de passe"}
          </Button>
        </form>
      </Box>

      <Box sx={{ flexShrink: 0 }}>
        <img
          src="/logoCPFMI.png"
          alt="Illustration"
          style={{ width: "200px", height: "auto" }}
        />
      </Box>
    </Box>
  );
};

export default FormNMotDePasse;
