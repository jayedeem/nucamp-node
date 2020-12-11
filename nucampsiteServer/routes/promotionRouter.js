const cors = require('./cors')
const express = require('express')
const Promotion = require('../models/promotions')
const promotionRouter = express.Router()
const { verifyUser, verifyAdmin } = require('../authenticate')

promotionRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Promotion.find()
      .then((promotion) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
      })
      .catch((err) => next(err))
  })
  .post(cors.corsWithOptions, verifyUser, verifyAdmin, (req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        console.log('Promotion Created ', promotion)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
      })
      .catch((err) => next(err))
  })
  .put(cors.corsWithOptions, verifyUser, verifyAdmin, (req, res) => {
    res.statusCode = 403
    res.end('PUT operation not supported on /promotions')
  })
  .delete(cors.corsWithOptions, verifyUser, verifyAdmin, (req, res, next) => {
    Promotion.deleteMany()
      .then((response) => {
        res.statusCode = 200
        res.setHeader('Content/-Type', 'application/json')
        res.json(response)
      })
      .catch((err) => next(err))
  })

promotionRouter
  .route('/:promotionsId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Promotion.findById(req.params.promotionsId)
      .then((promotion) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
      })
      .catch((err) => next(err))
  })
  .post(cors.corsWithOptions, verifyUser, verifyAdmin, (req, res) => {
    res.end(
      `Will add the promotions: ${req.body.name} with description: ${req.body.description}`
    )
  })
  .put(cors.corsWithOptions, verifyUser, verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionsId,
      {
        $set: req.body
      },
      {
        new: true
      }
    )
      .then((promotion) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotion)
      })
      .catch((err) => next(err))
  })
  .delete(cors.corsWithOptions, verifyUser, verifyAdmin, (req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionsId)
      .then((response) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(response)
      })
      .catch((err) => next(err))
  })

module.exports = promotionRouter
