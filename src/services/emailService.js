const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

class EmailService {
  static async sendWelcomeEmail(email, nombre) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Bienvenido a nuestra tienda online',
      html: `
        <h1>Bienvenido ${nombre}!</h1>
        <p>Gracias por registrarte en nuestra tienda online.</p>
        <p>Ahora puedes disfrutar de todos nuestros productos y ofertas.</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }

  static async sendOrderConfirmation(email, order) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Confirmación de pedido #${order.id_pedido}`,
      html: `
        <h1>¡Gracias por tu compra!</h1>
        <p>Tu pedido #${order.id_pedido} ha sido recibido y está siendo procesado.</p>
        <p>Total: $${order.total}</p>
        <p>Estado: ${order.estado}</p>
      `
    };

    return await transporter.sendMail(mailOptions);
  }
}

module.exports = EmailService;