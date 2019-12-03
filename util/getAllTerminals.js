if(!process.argv[2]) {
    return console.log('Usage: node .\\util\\getAllTerminals.js YOUR_TOKEN')
}

const CP = require('../controlpay.js');

const controlPay = new CP({
    token: process.argv[2],
    mode: process.argv[3] || 'production',
    debug: true
});

controlPay.administrative.setPassword(314159);
controlPay.terminal.getAll((e, res) => { console.log(res) });