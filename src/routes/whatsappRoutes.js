const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');

// Solo una ruta para info de contacto
router.get('/contact-info', whatsappController.getContactInfo);

module.exports = router;