const express = require('express');
const { validateCreateSession, validateDeleteSession } = require('../middlewares/validationMiddleware');
const { getSessions, createSession, deleteSession, getSession, getSessionsByProgramme, getSessionsOfStudent } = require('../controllers/session.controller');

const router = express.Router();
router.get('/list/', getSessions) // get by teacher

router.get('/list/:studentId', getSessionsOfStudent) // get by student

router.get('/programme', getSessionsByProgramme)

router.get('/:sessionId', getSession)

// TODO: FIX Validation for create session
router.post('/create', validateCreateSession, createSession)

router.delete('/delete', validateDeleteSession, deleteSession)

module.exports = router