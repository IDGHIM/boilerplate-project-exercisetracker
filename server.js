const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

// Connexion à la base MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.error('❌ Erreur de connexion MongoDB:', err))

// Middlewares globaux
app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false })) // Important pour parser x-www-form-urlencoded
app.use(express.json()) // Utile si tu veux aussi supporter le JSON

// Route d'accueil
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

// Import et utilisation des routes API
const apiRoutes = require('./routes/api')
app.use('/api', apiRoutes)

// Démarrage du serveur
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('🚀 Votre app écoute sur le port ' + listener.address().port)
})
