import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "", role: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Stockés dans localStorage
  const savedEmail = localStorage.getItem("savedEmail");
  const savedPassword = localStorage.getItem("savedPassword");

  useEffect(() => {
    document.title = "Connexion";
    document.body.style.backgroundColor = "#0367A6";
    // Ne pas pré-remplir formulaire, tout est vide au chargement
  }, []);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "email") {
        if (value === savedEmail && savedPassword) {
          // Email tapé correspond à sauvegardé => affiche mot de passe
          setRememberMe(true);
          return { ...prev, email: value, password: savedPassword };
        } else {
          // Sinon vide mot de passe
          setRememberMe(false);
          return { ...prev, email: value, password: "" };
        }
      }
      return { ...prev, [name]: value };
    });
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Échec de la connexion");

      // Sauvegarde ou suppression selon rememberMe
      if (rememberMe) {
        localStorage.setItem("savedEmail", formData.email);
        localStorage.setItem("savedPassword", formData.password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      // Stockage des infos session
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);
      localStorage.setItem("lastLoginDate", data.lastLoginDate);
      localStorage.setItem("email", data.email);
      localStorage.setItem("ip", data.ip);

      Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "Strict" });
      Cookies.set("role", data.role, { expires: 1, secure: true, sameSite: "Strict" });

      switch (data.role) {
        case "admin":
          navigate("/homeAdmin");
          break;
        case "entreprise":
          navigate("/homeentreprise");
          break;
        case "formateur":
          navigate("/homeformateur");
          break;
        default:
          break;
      }
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
          Connexion
        </Typography>

        {error && <Typography color="error">{error}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Mot de passe"
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                    size="large"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            select
            fullWidth
            label="Rôle"
            name="role"
            value={formData.role}
            onChange={handleChange}
            margin="normal"
            required
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="entreprise">Entreprise</MenuItem>
            <MenuItem value="formateur">Formateur</MenuItem>
          </TextField>

          <FormControlLabel
            control={<Checkbox checked={rememberMe} onChange={handleRememberMeChange} />}
            label="Enregistrer le mot de passe et l'adresse"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#F27405",
              "&:hover": { backgroundColor: "#F27405" },
            }}
            disabled={loading || !formData.email || !formData.password || !formData.role}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Se connecter"}
          </Button>

          <Typography mt={2}>
            Mot de passe oublié ?{" "}
            <Link to="/formnmotdepasse" style={{ color: "blue", textDecoration: "underline" }}>
              Regénérer mot de passe
            </Link>
          </Typography>
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

export default Login;
