const express = require('express');
const { check } = require('express-validator');
const {
  createInterview,
  getInterviews,
  getInterview,
  updateInterview,
  deleteInterview
} = require('../controllers/interview');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

// Create interview route with validation
router.post(
  '/',
  [
    check('scenario', 'Scenario is required').not().isEmpty(),
    check('meetingLink', 'Meeting link is required').not().isEmpty(),
    check('position', 'Position is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('scheduledTime', 'Scheduled time is required').not().isEmpty()
  ],
  createInterview
);

// Get all interviews for logged in user
router.get('/', getInterviews);

// Get, update, delete single interview
router.route('/:id')
  .get(getInterview)
  .put(updateInterview)
  .delete(deleteInterview);

module.exports = router;