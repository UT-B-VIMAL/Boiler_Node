const express = require('express');
const { getSample, createSample } = require('../controllers/sampleController');

const router = express.Router();

router.get("/", getSample);
router.post("/", createSample);

module.exports = router;
