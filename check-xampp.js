/**
 * Check if XAMPP Apache is running
 */

const http = require('http');

function checkXAMPP() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost', (res) => {
            resolve(true);
        });

        req.on('error', () => {
            resolve(false);
        });

        req.setTimeout(2000, () => {
            req.destroy();
            resolve(false);
        });
    });
}

async function main() {
    console.log('Checking XAMPP Apache...');
    const isRunning = await checkXAMPP();
    
    if (isRunning) {
        console.log('✅ XAMPP Apache is running');
        process.exit(0);
    } else {
        console.log('❌ XAMPP Apache is NOT running');
        console.log('');
        console.log('Please:');
        console.log('1. Open XAMPP Control Panel');
        console.log('2. Start Apache');
        console.log('3. Start MySQL');
        console.log('4. Then run: npm start');
        process.exit(1);
    }
}

main();

