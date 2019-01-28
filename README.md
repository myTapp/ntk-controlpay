## ntk-controlpay

NTK ControlPay Node.js API

### quick start
```
npm install ntk-controlpay
```

```
// setup
const CP = require('ntk-controlpay')
const controlPay = new CP({
    token: 'TOKEN',
    mode: 'sandbox',  // or 'production'
    pooling: true // if you don't want to use callback urls
})

controlPay.person.set(1234)
controlPay.terminal.set(1234)
```

### creating sells
```
controlPay.sale.sell({
    type: 'credit',
    referencia: null,
    iniciarTransacaoAutomaticamente: true,
    parcelamentoAdmin: null,
    valorTotalVendido: '40,00',
    quantidadeParcelas: 1
}, (e, res) => {
  
});
```

### login
```
controlPay.login('USER', 'PASSWORD', (e, res) => {
    controlPay.person.set(res.pessoa.id);
});
```

### objects
| objects | methods available |
| ------ | -------------- |
| terminal | add, getAll, set |
| sale | sell, cancel, get, getDetailed |
| person | create, set, getAvaiblePaymentTypes |
| product | create, getAll |
| order | create, get, getAll, cancel |
| client | create, get, getAll |
| token | create, edit, getAllCCs |
| print | create, get |
| administrative | create, setPassword |
