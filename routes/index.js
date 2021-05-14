const express = require('express');
const router = express.Router();

const { postBody } = require('../controllers/index');

router.post("/", postBody);
router.get("/", postBody);

module.exports = router;
