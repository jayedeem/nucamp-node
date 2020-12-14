const mongoose = require('mongoose')
const Schema = mongoose.Schema

const favoritesSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    campsites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campsite'
      }
    ]
  },
  {
    timestamps: true
  }
)
const Favorites = mongoose.model('Favorites', favoritesSchema)

module.exports = Favorites
