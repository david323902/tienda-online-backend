const express = require('express');
const router = express.Router();
const CookieController = require('../controllers/cookieController');
const { body } = require('express-validator');

const consentValidation = [
  body('cookies_aceptadas').isBoolean().withMessage('Debe ser verdadero o falso'),
  body('cookies_tecnicas').optional().isBoolean(),
  body('cookies_analiticas').optional().isBoolean(),
  body('cookies_marketing').optional().isBoolean()
];

router.get('/consent', CookieController.getConsent);
router.post('/consent', consentValidation, CookieController.saveConsent);

module.exports = router;
