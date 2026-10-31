const { exec } = require('child_process');
const os = require('os');

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
                    exec(`taskkill /PID ${pid} /F`, (killErr) => {
                        if (!killErr) {
                        }
                        killed++;
                        if (killed === pids.size) {
                            resolve();
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
                    exec(`kill -9 ${pid}`, (killErr) => {
                        if (!killErr) {
                        }
                        killed++;
                        if (killed === pids.length) {
                            resolve();
                        }
                    });
                });
            });
        }
    });
}

async function killPorts() {
    await killPort(5000);
    await killPort(3000);
}

killPorts();