const express = require('express');
const router = express.Router();
const { addMaterial, getMaterialsForDate } = require('../controllers/material.controller');
const multerMiddleware = require('../middlewares/multerMiddleware')

// POST /api/materials
router.post('/', multerMiddleware.upload.single("material"),  addMaterial);

// GET /api/materials/:sessionId?date=YYYY-MM-DD
router.get('/:sessionId', getMaterialsForDate);

module.exports = router;
