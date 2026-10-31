#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const path = require('path');
const os = require('os');

// Función para matar procesos en un puerto
function killPort(port) {
  return new Promise((resolve) => {
    const isWindows = os.platform() === 'win32';
    
    if (isWindows) {
      // Windows
      exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
        if (!stdout) {
          return resolve();
        }

        const lines = stdout.trim().split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
          const match = line.match(/LISTENING\s+(\d+)/);
          if (match && match[1]) {
            pids.add(match[1]);
          }
        });

        if (pids.size === 0) {
          return resolve();
        }

        let killed = 0;
        pids.forEach(pid => {
          exec(`taskkill /PID ${pid} /F`, () => {
            killed++;
            if (killed === pids.size) {
              setTimeout(() => {
                resolve();
              }, 500);
            }
          });
        });
      });
    } else {
      // Mac/Linux
      exec(`lsof -ti:${port}`, (err, stdout) => {
        if (!stdout) {

          return resolve();
        }

        const pids = stdout.trim().split('\n').filter(Boolean);
        
        if (pids.length === 0) {

          return resolve();
        }

        let killed = 0;
        pids.forEach(pid => {
          exec(`kill -9 ${pid}`, () => {
            killed++;
            if (killed === pids.length) {
              setTimeout(() => {
                resolve();
              }, 500);
            }
          });
        });
      });
    }
  });
}

// Función para ejecutar un comando
function runCommand(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options
  });

  child.on('error', (error) => {
    console.error(`❌ Error ejecutando ${command}:`, error.message);
  });

  return child;
}

// Función para manejar la salida graceful
async function gracefulShutdown(processes) {
  
  processes.forEach(proc => {
    if (proc && !proc.killed) {
      proc.kill('SIGTERM');
    }
  });

  // Esperar un momento para que los procesos terminen
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Limpiar puertos
  await killPort(5000);
  await killPort(3000);
  
  process.exit(0);
}

// Función principal
async function startApp() {
  
  // Limpiar puertos antes de iniciar
  await killPort(5000);
  await killPort(3000);
  

  // Array para almacenar los procesos
  const processes = [];

  // Manejar señales de cierre
  process.on('SIGINT', () => gracefulShutdown(processes));
  process.on('SIGTERM', () => gracefulShutdown(processes));

  // Iniciar backend
  const backendProcess = runCommand('npm', ['start'], { 
    cwd: path.join(__dirname, 'backend') 
  });
  processes.push(backendProcess);

  // Esperar a que el backend se inicie
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Iniciar frontend
  const frontendProcess = runCommand('npm', ['start'], { 
    cwd: __dirname,
  });
  processes.push(frontendProcess);

  //console.log('📱 Frontend: http://localhost:3000');
  //console.log('🔧 Backend: http://localhost:5000');
}

// Ejecutar la app
startApp().catch(error => {
  console.error('❌ Error al iniciar la aplicación:', error);
  process.exit(1);
});