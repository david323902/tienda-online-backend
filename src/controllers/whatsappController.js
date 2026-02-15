const logger = require('../config/logger');

const whatsappController = {
  getContactInfo: async (req, res) => {
    try {
      const phoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '+573165384465';
      const defaultMessage = process.env.WHATSAPP_DEFAULT_MESSAGE || 'Hola, tengo una consulta';
      
      res.json({
        success: true,
        data: {
          phoneNumber,
          defaultMessage,
          whatsappLink: `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodeURIComponent(defaultMessage)}`
        }
      });
    } catch (error) {
      logger.error('Error en WhatsApp controller:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener información de WhatsApp'
      });
    }
  }
};

module.exports = whatsappController;