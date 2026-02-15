'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('productos', [
      {
        nombre: 'Laptop Gaming HP Omen',
        descripcion: 'Laptop gaming con procesador i7, 16GB RAM, 1TB SSD, RTX 3060',
        precio: 1299.99,
        stock: 10,
        imagen: 'laptop-gaming.jpg',
        activo: true,
        categoria: 'Electrónica',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Mouse Logitech G502',
        descripcion: 'Mouse gaming con sensor HERO 25K, 11 botones programables',
        precio: 79.99,
        stock: 50,
        imagen: 'mouse-gaming.jpg',
        activo: true,
        categoria: 'Accesorios',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Teclado Mecánico Redragon',
        descripcion: 'Teclado mecánico retroiluminado, switches Outemu Blue',
        precio: 89.99,
        stock: 30,
        imagen: 'teclado-mecanico.jpg',
        activo: true,
        categoria: 'Accesorios',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Monitor Samsung 27" 4K',
        descripcion: 'Monitor 4K UHD, 144Hz, FreeSync, panel IPS',
        precio: 499.99,
        stock: 15,
        imagen: 'monitor-4k.jpg',
        activo: true,
        categoria: 'Monitores',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Auriculares Sony WH-1000XM4',
        descripcion: 'Auriculares inalámbricos con cancelación de ruido',
        precio: 349.99,
        stock: 25,
        imagen: 'auriculares-sony.jpg',
        activo: true,
        categoria: 'Audio',
        creado_en: new Date(),
        actualizado_en: new Date()
      },
      {
        nombre: 'Smartphone Samsung Galaxy S23',
        descripcion: 'Teléfono inteligente con cámara de 50MP, 256GB almacenamiento',
        precio: 899.99,
        stock: 20,
        imagen: 'samsung-s23.jpg',
        activo: true,
        categoria: 'Celulares',
        creado_en: new Date(),
        actualizado_en: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('productos', null, {});
  }
};