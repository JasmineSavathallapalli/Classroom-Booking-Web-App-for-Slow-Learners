const { body, validationResult } = require('express-validator');

//
// 🔐 AUTH VALIDATION
//

// ✅ Sign Up Validation
exports.validateSignUp = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['student', 'teacher']).withMessage('Role must be either "student" or "teacher"'),

  body('registerNumber')
    .if(body('role').equals('student'))
    .notEmpty().withMessage('Register number is required for students'),

  body('programme')
    .if(body('role').equals('student'))
    .notEmpty().withMessage('Programme is required for students')
    .isString().withMessage('Programme must be a string'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// ✅ Log In Validation
exports.validateLogIn = [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

//
// 👤 USER VALIDATION
//

// ✅ Delete User
exports.validateDeleteUser = [
  body('id').isMongoId().withMessage('Invalid id'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// ✅ Get Subjects by User ID
exports.validateGetSubjects = [
  body('id').isMongoId().withMessage('Invalid id'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

//
// 📅 SESSION VALIDATION
//

// ✅ Create Session
exports.validateCreateSession = [
  body('sessionName').notEmpty().withMessage('Session name is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('timeSlot.startTime').notEmpty().withMessage('Start time is required'),
  body('timeSlot.endTime').notEmpty().withMessage('End time is required'),
  body('sessionType').isIn(['Single', 'Week-Long', 'Semester-Long', 'Custom']).withMessage('Invalid session type'),
  body('dates').isArray({ min: 1 }).withMessage('At least one date is required'),
  body('dates.*').isISO8601().withMessage('Each date must be in YYYY-MM-DD format'),
  body('classroom').notEmpty().withMessage('Classroom is required'),
  body('maxSeats').isInt({ min: 1 }).withMessage('Max seats must be a positive number'),
  body('teacherId').isMongoId().withMessage('Invalid teacher ID'),
  body('programme').notEmpty().withMessage('Programme is required').isString().withMessage('Programme must be a string'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];


// ✅ Delete Session
exports.validateDeleteSession = [
  body('id').isMongoId().withMessage('Invalid id'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

//
// 🏫 CLASSROOM VALIDATION
//

// ✅ Add Classroom
exports.validateAddClassroom = [
  body('name').isString().withMessage('Name must be a string'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be a positive integer'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// ✅ Delete Classroom
exports.validateDeleteClassroom = [
  body('id').isMongoId().withMessage('Invalid id'),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

//
// 📝 BOOKING VALIDATION
//

// ✅ Create Booking
exports.validateCreateBooking = [
  body('sessionId').isMongoId().withMessage('Invalid session ID'),
  body('studentId').isMongoId().withMessage('Invalid student ID'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// ✅ Cancel Booking
exports.validateCancelBooking = [
  body('id').isMongoId().withMessage('Invalid booking ID'),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];
