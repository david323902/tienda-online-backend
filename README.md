# Backend de Tienda Online (E-commerce)

Backend para un sistema de **comercio electrónico**, diseñado bajo una
arquitectura **MVC**, con autenticación segura, gestión de pedidos y
procesamiento de pagos en línea.

---

## 🚀 Descripción del Proyecto

Este proyecto implementa una **API RESTful** para una tienda online, encargada
de la gestión de usuarios, productos, carrito de compras, pedidos y pagos,
garantizando seguridad y consistencia de datos.

---

## 🧠 Arquitectura

- **Backend:** Node.js + Express
- **Base de Datos:** PostgreSQL
- **ORM:** Sequelize
- **Arquitectura:** MVC (Modelo–Vista–Controlador)

---

## ⚙️ Tecnologías y Funcionalidad

### Núcleo
- **Node.js**
- **Express**
  - Rutas como `/api/products`, `/api/cart`, `/api/orders`

### Base de Datos
- **PostgreSQL**
- **Sequelize**
  - Modelado de entidades (User, Product, Order).
  - Manejo de transacciones para pedidos.

### Seguridad
- **JWT:** Autenticación basada en tokens.
- **bcrypt:** Hash seguro de contraseñas.
- **Helmet:** Protección contra vulnerabilidades HTTP.
- **Express Rate Limit:** Prevención de ataques de fuerza bruta.
- **CORS:** Comunicación segura con el frontend.

### Pagos
- **PayPal SDK**
  - Creación y captura de órdenes de pago.
  - Integración directa con la API de PayPal.

### Validaciones y Utilidades
- **express-validator:** Validación de datos de entrada.
- **dotenv:** Manejo de variables de entorno.
- **multer:** Subida de imágenes de productos.

### Logging y Monitoreo
- **Morgan:** Registro de peticiones HTTP.
- **Winston:** Logging avanzado de errores y eventos.

### Funcionalidades Adicionales
- **Nodemailer:** Envío de correos (confirmación de pedidos).
- Integración de notificaciones vía **WhatsApp**.

---

## 🎯 Funcionalidades Clave

- Autenticación y autorización de usuarios.
- Gestión de productos y carrito.
- Creación segura de pedidos.
- Pagos en línea con PayPal.
- Subida de imágenes de productos.
- Registro y monitoreo de errores.

---

## 🛠️ Estado del Proyecto
🟢 Funcional / Backend robusto.

---

## 👤 Autor

**Johan David Toro Ortiz**  
Desarrollador Backend Junior  
