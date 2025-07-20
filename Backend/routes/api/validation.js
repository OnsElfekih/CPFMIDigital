// Dans votre backend (routes/formations.js)
router.get('/', async (req, res) => {
  try {
    const formations = await Formation.find({}, 'idSession titre statut dateDebut duree'); // Sélection des champs
    res.json(formations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});