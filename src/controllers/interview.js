const Interview = require('../models/Interview');
const { validationResult } = require('express-validator');

// @desc    Create new interview session
// @route   POST /api/interview
// @access  Private
exports.createInterview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const interview = await Interview.create(req.body);

    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all interviews for logged in user
// @route   GET /api/interview
// @access  Private
exports.getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      count: interviews.length,
      data: interviews
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single interview
// @route   GET /api/interview/:id
// @access  Private
exports.getInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }

    // Make sure user owns the interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this interview'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update interview
// @route   PUT /api/interview/:id
// @access  Private
exports.updateInterview = async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }

    // Make sure user owns the interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to update this interview'
      });
    }

    interview = await Interview.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete interview
// @route   DELETE /api/interview/:id
// @access  Private
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        error: 'Interview not found'
      });
    }

    // Make sure user owns the interview
    if (interview.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to delete this interview'
      });
    }

    await interview.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};