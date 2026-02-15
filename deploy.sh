#!/bin/bash
echo "🚀 INICIANDO DESPLIEGUE A PRODUCCIÓN"

# Variables
SERVER_HOST="access-5019456361.webspace-host.com"
SERVER_USER="su573814"
SERVER_PORT="22"
REMOTE_DIR="/home/su573814/tienda-backend"

# 1. Verificar que tenemos todos los archivos necesarios
echo "📦 Verificando archivos locales..."
if [ ! -f "package.json" ]; then
  echo "❌ ERROR: No se encuentra package.json"
  exit 1
fi

if [ ! -f "src/server.js" ]; then
  echo "❌ ERROR: No se encuentra src/server.js"
  exit 1
fi

# 2. Instalar dependencias locales
echo "📦 Instalando dependencias..."
npm ci --only=production

# 3. Crear archivos de configuración si no existen
echo "⚙️  Preparando configuración..."
if [ ! -f ".env.production" ]; then
  echo "⚠️  Advertencia: .env.production no encontrado, creando uno básico..."
  cp .env .env.production
fi

# 4. Conectar al servidor y desplegar
echo "🌐 Conectando al servidor remoto..."

# Usar SCP para copiar archivos
echo "📤 Subiendo archivos al servidor..."

# Crear lista de archivos a subir (excluyendo node_modules, .git, etc.)
cat > deploy-files.txt << EOF
package.json
package-lock.json
ecosystem.config.js
deploy.sh
.env.production
src/
config/
controllers/
models/
routes/
.gitignore
EOF

# Subir archivos
echo "Subiendo archivos..."
sshpass -p 'Proyecto2026' scp -P $SERVER_PORT -r \
  $(cat deploy-files.txt) \
  $SERVER_USER@$SERVER_HOST:$REMOTE_DIR/

# 5. Ejecutar comandos en el servidor remoto
echo "🖥️  Configurando servidor remoto..."

sshpass -p 'Proyecto2026' ssh -p $SERVER_PORT $SERVER_USER@$SERVER_HOST << 'ENDSSH'
  cd /home/su573814/tienda-backend
  
  echo "🔧 Configurando entorno de producción..."
  
  # Renombrar .env.production a .env
  if [ -f ".env.production" ]; then
    cp .env.production .env
    echo "✅ Variables de entorno configuradas"
  fi
  
  # Instalar dependencias
  echo "📦 Instalando dependencias en el servidor..."
  npm ci --only=production
  
  # Instalar PM2 globalmente si no está
  echo "⚙️  Instalando PM2..."
  npm install -g pm2
  
  # Iniciar aplicación con PM2
  echo "🚀 Iniciando aplicación..."
  pm2 stop tienda-backend || true
  pm2 delete tienda-backend || true
  pm2 start ecosystem.config.js --env production
  
  # Guardar configuración PM2
  pm2 save
  
  # Configurar inicio automático
  pm2 startup | tail -n 1 | bash
  
  echo "✅ Despliegue completado!"
  
  # Mostrar estado
  echo "📊 Estado de la aplicación:"
  pm2 status
  
  # Mostrar logs
  echo "📝 Últimos logs:"
  pm2 logs tienda-backend --lines 20
ENDSSH

echo "🎉 ¡DESPLIEGUE COMPLETADO!"
echo "🌐 Tu aplicación está disponible en: http://$SERVER_HOST:3000"