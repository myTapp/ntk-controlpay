const CP = require('./controlpay.js');
const Leite = require('leite');
const leite = new Leite();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Instancia objeto
const controlPay = new CP({
    token: 'TOKEN',
    mode: 'sandbox',
    pooling_time: 2000,
    pooling: false,
    server: app,
    debug: true
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

controlPay.administrative.setPassword(314159);

// Login
controlPay.login('USER', 'PASSWORD', (e, res) => {
    controlPay.person.set(res.pessoa.id);
    controlPay.terminal.getAll((e, res) => {
        for (let r = 0; r < res.length; r++) {
            if (res[r].nome === 'TERMINAL_NAME') {
                controlPay.terminal.set(res[r].id);

                return sell();
            }
        }
    });
});

function sell() {
    if (sales[sell_count]) {
        controlPay.sale.sell(sales[sell_count], (e, body) => {
            sales[sell_count].id = body.id;
        });
    }
    else {
        checkPayments();
    }
}

function checkPayments() {
    controlPay.sale.get(sales[0].id, (e, res) => {
        console.log(res);
        controlPay.sale.get(sales[2].id, (e, res) => {
            console.log(res);
            controlPay.administrative.create((e, res) => {
                cancelPayments();
            });
        });
    });
}

function cancelPayments() {
    controlPay.sale.cancel(sales[0].id, (e, res) => {
        console.log(res);
        controlPay.sale.cancel(sales[2].id, (e, res) => {
            console.log(res);
        });
    });
}

var sell_count = 0;
controlPay.addEventListener('sale.callback', (sale) => {
    sell_count++;
    setTimeout(sell, 1000);
});

var sales = [{
    type: 'credit',
    referencia: null,
    iniciarTransacaoAutomaticamente: true,
    parcelamentoAdmin: null,
    valorTotalVendido: '40,00',
    quantidadeParcelas: 2
},
{
    type: 'debit',
    referencia: null,
    iniciarTransacaoAutomaticamente: true,
    parcelamentoAdmin: null,
    valorTotalVendido: '10,00',
    quantidadeParcelas: 1,
    aquirente: '',
},
{
    referencia: null,
    iniciarTransacaoAutomaticamente: true,
    parcelamentoAdmin: null,
    valorTotalVendido: '42,00',
    quantidadeParcelas: 1,
    aquirente: '',
}];