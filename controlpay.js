const request = require('request');
const _endpoints = require('./endpoints.js');
const _payment_modes = require('./payment-modes.js');

class ControlPay {
    constructor(options) {
        this.base_url = options.mode === 'production' ? 'controlpay.ntk.com.br/webapi/' : 'pay2alldemo.azurewebsites.net/webapi/';
        this.protocol = 'https://';
        this.watchers = [];

        this.options = {
            pooling_time: 500
        };
        Object.assign(this.options, options);

        let exposed = ['terminal', 'sale', 'person', 'product', 'order', 'client', 'token', 'print', 'acquirer', 'administrative'];

        for (let e = 0; e < exposed.length; e++) {
            try {
                this[exposed[e]] = this[exposed[e] + 'Object']();
            }
            catch (err) { }
        }

        this.getE = (e) => { return Object.assign({}, _endpoints[e]); }

        if (this.options.server) {
            this.initCallbackServer();
        }
    }

    terminalObject() {
        return {
            add: (data, cb) => {
                this.resolveEndpoint('terminal.add', data, cb);
            },
            getAll: (cb) => {
                this.resolveEndpoint('terminal.getByPersonId', { person_id: this.options.person_id }, (e, res) => {
                    cb(e, res.terminais);
                });
            },
            set: function (id) {
                this.id = id;
            }
        }
    }

    saleObject() {
        return {
            sell: (data, cb) => {
                data.formaPagamentoId = _payment_modes[data.type];
                data.formaPagamentoId = data.formaPagamentoId || 24;

                this.resolveEndpoint('sale.sell', data, (e, body) => {
                    if (this.sale.callback && this.options.pooling !== false) {
                        this.dispatchSellWatcher(body);
                    }
                    if(body) {
                        cb(e, body.intencaoVenda);
                    }
                    else {
                        cb(e, body);                       
                    }
                });
            },
            cancel: (id, cb) => {
                let data = {
                    aguardarTefIniciarTransacao: false,
                    senhaTecnica: this.administrative.technical_pw,
                    terminalId: this.terminal.id,
                    intencaoVendaId: id
                }
                this.resolveEndpoint('sale.cancel', data, cb);
            },
            get: (id, cb) => {
                let data = { intencaoVendaId: id };
                this.resolveEndpoint('sale.get', data, (e, body) => {
                    if(cb) {
                        cb(e, body.intencoesVendas);
                    }
                });
            },
            getDetailed: (data, cb) => {
                this.resolveEndpoint('sale.getDetailed', data, cb);
            },
        };
    }

    personObject() {
        return {
            create: (data, cb) => {-
                this.resolveEndpoint('person.create', data, cb, false);
            },
            set: function (id) {
                this.id = id;
            },
            getAvaiblePaymentTypes: (cb) => {
                this.resolveEndpoint('person.avaiblePayments', {}, (e, res) => {
                    try {
                        if (!e && res.formasPagamento) {
                            cb(e, res.formasPagamento);
                        }
                        else {
                            cb(e, res);
                        }
                    } catch (err) { }
                });
            }
        };
    }

    productObject() {
        return {
            getAll: (cb) => {
                this.resolveEndpoint('product.getAll', {}, (e, res) => {
                    try {
                        if (!e && res.produtos) {
                            cb(e, res.produtos);
                        }
                        else {
                            cb(e, res);
                        }
                    } catch (err) { }
                });
            },
            create: (data, cb) => {
                this.resolveEndpoint('product.create', data, cb);
            }
        };
    }

    orderObject() {
        return {
            create: (data, cb) => {
                data.pessoaVendedorId = this.person.id;
                this.resolveEndpoint('order.create', data, cb, false);
            },
            get: (id, cb) => {
                this.resolveEndpoint('order.get', { pedidoId: id }, cb);
            },
            getAll: (cb) => {
                this.resolveEndpoint('order.getAll', { pessoaIds: this.person.id }, (e, res = {}) => {
                    cb(e, res.pedidos);
                });
            },
            cancel: (id, cb) => {
                this.resolveEndpoint('order.cancel', { pedidoId: id }, cb);
            },
        };
    }

    clientObject() {
        return {
            create: (data, cb) => {
                data.pessoaId = this.person.id;
                this.resolveEndpoint('client.create', data, cb);
            },
            get: (id, cb) => {
                this.resolveEndpoint('client.get', { clienteId: id }, (e, res = {}) => {
                    cb(e, res.cliente);
                });
            },
            getAll: (cb) => {
                this.resolveEndpoint('client.getAll', {}, (e, res = {}) => {
                    cb(e, res.clientes);
                });
            },
        };
    }

    tokenObject() {
        return {
            create: (data, cb) => {
                this.resolveEndpoint('token.create', data, cb);
            },
            edit: (data, cb) => {
                this.resolveEndpoint('token.edit', data, cb);
            },
            getAllCCs: (id, cb) => {
                this.resolveEndpoint('token.getAll', { clienteId: id }, (e, res = {}) => {
                    cb(e, res.listaClienteCartao);
                });
            }
        };
    }

    printObject() {
        return {
            create: (data, cb) => {
                data.terminalId = this.terminal.id;
                this.resolveEndpoint('print.create', data, (e, res = {}) => {
                    cb(e, res.intencaoImpressao);
                });
            },
            get: (id, cb) => {
                this.resolveEndpoint('print.get', { intencaoImpressaoId: id }, (e, res = {}) => {
                    cb(e, res.intencaoImpressao);
                });
            },
        };
    }

    administrativeObject() {
        return {
            create: (cb) => {
                this.resolveEndpoint('administrative.create', {
                    senhaTecnica: this.administrative.technical_pw,
                    terminalId: this.terminal.id
                }, (e, res = {}) => {
                    cb(e, res);
                });
            },
            setPassword: function (pw) {
                this.technical_pw = pw;
            }
        }
    }

    login(login, pw, cb) {
        this.resolveEndpoint('login', {
            cpfCnpj: login,
            senha: pw
        }, (e, res = {}) => {
            cb(e, res);
        });
    }

    acquirerObject() {
        return {
            getAll: () => { } // TODO achar uma lista das adquirentes dispon�veis
        }
    }

    addEventListener(listener, cb) {
        this.updateObject(this, cb, listener);
    }

    recompose(obj, string) {
        let parts = string.split('.');
        let newObj = obj[parts[0]];
        if (parts[1]) {
            parts.splice(0, 1);
            let newString = parts.join('.');
            return this.recompose(newObj, newString);
        }
        return newObj;
    }

    updateObject(object, newValue, path) {
        let stack = path.split('.');
        while (stack.length > 1) {
            object = object[stack.shift()];
        }
        object[stack.shift()] = newValue;
    }

    dispatchSellWatcher(body) {
        if (body && body.intencaoVenda && body.intencaoVenda.id) {
            this.watchers.push({
                id: body.intencaoVenda.id, interval: setInterval(() => {
                    this.sale.get(body.intencaoVenda.id, (e, body) => {
                        let status;
                        if (body && body[0]) {
                            status = body[0].intencaoVendaStatus;
                            if (status.id >= 10) { 
                                for(let w = 0; w < this.watchers.length; w++) {
                                    if(this.watchers[w].id === body[0].id) {
                                        clearInterval(this.watchers[w].interval);
                                        this.watchers[w] = null;
                                        this.watchers.splice(w, 1);
                                        break;
                                    }
                                }

                                try {
                                    this.sale.callback(body[0]);
                                }
                                catch (err) {
                                    console.error(err);
                                }
                            }
                            else{
                                if(this.options.any_status_callback === true) {
                                    try {
                                        this.sale.callback(null, body[0]);
                                    }
                                    catch (err) {
                                        console.error(err);
                                    }
                                }
                            }
                        }
                    });
                }, this.options.pooling_time)
            });
        }
    }

    resolveEndpoint(endpoint, data, cb, injectData) {
        endpoint = this.getEndpoint(endpoint, data, injectData);
        data = this.prepareData(data);
        request[endpoint.type]({
            url: endpoint.url,
            body: data,
            json: true
        }, (e, r, body) => {
            if (this.options.debug === true) {
                console.log(`[${endpoint.type.toUpperCase()}] ${endpoint.url}`);
            }
            if (cb) {
                try {
                    cb(e, body);
                }
                catch (err) {
                    console.warn(err);
                }
            }
        });
    }

    getEndpoint(endpoint, data, injectData) {
        let e = this.getE(endpoint);
        e.url = this.protocol + this.base_url + e.url.split('key=').join('key=' + this.options.token);

        if (injectData !== false) {
            e.url = e.url.split('pessoaId=').join('pessoaId=' + (data.person_id || this.person.id));
            for (var key in data) {
                e.url = e.url.split(key + '=').join(key + '=' + data[key]);
            }
        }

        return e;
    }

    prepareData(data) {
        data.terminalId = this.terminal.id;
        return data;
    }

    initCallbackServer() {
        try {
            if(this.options.server && this.options.server.post) {
                this.options.server.post('/sell/callback', (req, res) => {
                    if (this.sale.callback) {
                        this.sale.get(req.query.intencaoVendaId, (e, _res) => {
                            try {
                                this.sale.callback(_res.intencoesVendas[0]);
                            } catch (err) { console.error(err); }
                        });
                    }
                    res.sendStatus(200);
                });
    
                this.options.server.post('/order/callback', (req, res) => {
                    if (this.order.callback) {
                        this.order.get(req.query.intencaoVendaId, (e, _res) => {
                            try {
                                this.order.callback(req.query);
                            } catch (err) { console.error(err); }
                        });
                    }
                    res.sendStatus(200);
                });
            }
            else {
                console.error('Invalid server')
            }
        }
        catch (err) { console.error(err); }
    }
}

module.exports = ControlPay;