const express = require('express')
const router = express.Router()

const User = require('../models/User')
const Exercise = require('../models/Exercise')

// Créer un utilisateur
router.post('/users', async (req, res) => {
  try {
    const newUser = new User({ username: req.body.username })
    const savedUser = await newUser.save()
    res.json({ username: savedUser.username, _id: savedUser._id })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Lister tous les utilisateurs
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username _id')
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Ajouter un exercice
router.post('/users/:_id/exercises', async (req, res) => {
  try {
    const { description, duration, date } = req.body
    const userId = req.params._id

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    const exerciseDate = date ? new Date(date) : new Date()

    const exercise = new Exercise({
      userId: user._id,
      description,
      duration: parseInt(duration),
      date: exerciseDate
    })

    const savedExercise = await exercise.save()

    res.json({
      _id: user._id,
      username: user.username,
      date: savedExercise.date.toDateString(),
      duration: savedExercise.duration,
      description: savedExercise.description
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

// Récupérer les logs
router.get('/users/:_id/logs', async (req, res) => {
  try {
    const { from, to, limit } = req.query
    const userId = req.params._id

    const user = await User.findById(userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    let filter = { userId: user._id }

    if (from || to) {
      filter.date = {}
      if (from) filter.date.$gte = new Date(from)
      if (to) filter.date.$lte = new Date(to)
    }

    let query = Exercise.find(filter)

    if (limit) query = query.limit(parseInt(limit))

    const exercises = await query.exec()

    res.json({
      _id: user._id,
      username: user.username,
      count: exercises.length,
      log: exercises.map(ex => ({
        description: ex.description,
        duration: ex.duration,
        date: ex.date.toDateString()
      }))
    })
  } catch (err) {
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
