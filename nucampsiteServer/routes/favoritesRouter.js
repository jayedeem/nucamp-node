// favoriteRouter.route('/') and favoriteRouter.route('/:campsiteId').

const express = require('express')
const favoritesRouter = express.Router()
const Favorite = require('../models/favorites')
const cors = require('./cors')
const user = require('../models/user')

const { verifyUser, verifyAdmin } = require('../authenticate')
favoritesRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Favorite.find({ user: req.user._id })
      .populate('user')
      .populate('campsite')
      .then((favorite) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorite)
      })
      .catch((err) => next(err))
  })
  .post(cors.corsWithOptions, verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorites) => {
      if (favorites) {
        req.body.forEach((campsite) => {
          if (!favorites.campsites.includes(campsite._id)) {
            favorites.campsites.push(campsite._id)
          }
        })
        favorites.save().then((favorites) => {
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.json(favorites)
        })
      } else {
        Favorite.create({ user: req.user._id, campsites: req.body })
          .then((favorites) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(favorites)
          })
          .catch((err) => next(err))
      }
    })
  })
  .put(cors.corsWithOptions, verifyUser, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorite')
  })
  .delete(cors.corsWithOptions, verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id })
      .then((favorites) => {
        if (favorites) {
          favorites.remove()
        }
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorites)
      })
      .catch((err) => next(err))
  })

favoritesRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.corsWithOptions, verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end(`GET operation not supported on /favorite/${req.params.campsiteId}`)
  })
  .post(cors.corsWithOptions, verifyUser, (req, res) => {
    Favorite.findOne({ user: req.user._id })
      .then((campsite) => {
        if (campsite) {
          if (campsite.campsites.includes(req.params.campsiteId)) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(`This campsite has already included`)
          } else {
            campsite.campsites.push(req.params.campsiteId)
            campsite
              .save()
              .then((el) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(el)
              })
              .catch((err) => next(err))
          }
        } else {
          const favoriteCampsite = new Favorite({
            user: req.user._id,
            campsites: req.params.campsiteId
          })
          Favorite.create(favoriteCampsite)
            .then((favCampsite) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(favCampsite)
            })
            .catch((err) => next(err))
        }
      })
      .catch((err) => next(err))
  })
  .put(cors.corsWithOptions, verifyUser, (req, res, next) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /favorite/:campsiteId')
  })
  .delete(cors.corsWithOptions, verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorites) => {
      if (favorites) {
        if (favorites.campsites.includes(req.params.campsiteId)) {
          favorites.campsites.splice(
            favorites.campsites.indexOf(req.params.campsiteId),
            1
          )
          favorites.save().then((favorites) => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json(favorites)
          })
        } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.json(favorites)
        }
      }
    })
  })

module.exports = favoritesRouter
