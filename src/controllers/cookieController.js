const { CookieConsent } = require('../models');

class CookieController {
  static async saveConsent(req, res) {
    try {
      const { 
        cookies_aceptadas, 
        cookies_tecnicas, 
        cookies_analiticas, 
        cookies_marketing 
      } = req.body;

      const consentData = {
        session_id: req.sessionID || `session_${Date.now()}`,
        cookies_aceptadas: cookies_aceptadas || false,
        cookies_tecnicas: cookies_tecnicas !== undefined ? cookies_tecnicas : true,
        cookies_analiticas: cookies_analiticas || false,
        cookies_marketing: cookies_marketing || false,
        ip_address: req.ip,
        user_agent: req.headers['user-agent']
      };

      if (req.user) {
        consentData.id_usuario = req.user.id_usuario;
      }

      const consent = await CookieConsent.create(consentData);

      res.cookie('cookie_consent', JSON.stringify({
        aceptadas: consent.cookies_aceptadas,
        tecnicas: consent.cookies_tecnicas,
        analiticas: consent.cookies_analiticas,
        marketing: consent.cookies_marketing,
        fecha: new Date().toISOString()
      }), {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production'
      });

      res.json({
        message: 'Preferencias de cookies guardadas',
        consent: {
          id_consent: consent.id_consent,
          cookies_aceptadas: consent.cookies_aceptadas,
          cookies_tecnicas: consent.cookies_tecnicas,
          cookies_analiticas: consent.cookies_analiticas,
          cookies_marketing: consent.cookies_marketing,
          fecha_consentimiento: consent.creado_en
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getConsent(req, res) {
    try {
      let consent;

      if (req.user) {
        consent = await CookieConsent.findOne({
          where: { id_usuario: req.user.id_usuario },
          order: [['creado_en', 'DESC']]
        });
      } else if (req.cookies?.cookie_consent) {
        try {
          const cookieData = JSON.parse(req.cookies.cookie_consent);
          return res.json({
            from_cookie: true,
            ...cookieData
          });
        } catch (e) {
          // Cookie inválida
        }
      }

      if (!consent) {
        return res.json({
          cookies_aceptadas: false,
          cookies_tecnicas: true,
          cookies_analiticas: false,
          cookies_marketing: false
        });
      }

      res.json({
        cookies_aceptadas: consent.cookies_aceptadas,
        cookies_tecnicas: consent.cookies_tecnicas,
        cookies_analiticas: consent.cookies_analiticas,
        cookies_marketing: consent.cookies_marketing,
        fecha_consentimiento: consent.creado_en
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = CookieController;