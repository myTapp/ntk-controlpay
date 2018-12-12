# ntk-controlpay
NTK ControlPay Node.js API

## quick-start
```
npm install ntk-controlpay
```

```
// setup
const controlPay = new CP({
    token: 'TOKEN',
    mode: 'sandbox',
    pooling: true
});

controlPay.person.set(1234);
controlPay.terminal.set(1234);
```

## criando uma intenção de venda
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

## objetos disponíveis
| Objeto | Métodos |
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
