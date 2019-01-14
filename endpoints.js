module.exports = {
    'terminal.add': {
        url: 'Terminal/Insert?key=',
        type: 'post'
    },
    'terminal.getByPersonId': {
        url: 'Terminal/GetByPessoaId?key=&pessoaId=',
        type: 'post'
    },
    'sale.sell': {
        url: 'Venda/Vender/?key=',
        type: 'post'
    },
    'sale.cancel': {
        url: 'Venda/CancelarVenda?key=',
        type: 'post'
    },
    'sale.get': {
        url: 'IntencaoVenda/GetByFiltros?key=',
        type: 'post'
    },
    'sale.getDetailed': {
        url: 'PagamentoExterno/GetByFiltros/?key=',
        type: 'post'
    },
    'person.create': {
        url: 'Pessoa/Insert',
        type: 'post'
    },
    'person.avaiblePayments': {
        url: 'FormaPagamento/GetByPessoaId?key=&pessoaId=',
        type: 'get'
    },
    'product.getAll': {
        url: 'Produto/GetByPessoaId?key=&pessoaId=',
        type: 'post'
    },
    'product.create': {
        url: 'Produto/Insert?key=&pessoaId=',
        type: 'post'
    },
    'order.create': {
        url: 'Pedido/Insert/?key=',
        type: 'post'
    },
    'order.get': {
        url: 'Pedido/GetById?key=&pedidoId=',
        type: 'get'
    },
    'order.getAll': {
        url: 'Pedido/GetByFiltros?key=',
        type: 'post'
    },
    'order.cancel': {
        url: 'Pedido/Cancelar?key=&pedidoId=',
        type: 'get'
    },
    'client.create': {
        url: 'Cliente/Insert?key=',
        type: 'post'
    },
    'client.get': {
        url: 'Cliente/GetById?key=&clienteId=',
        type: 'post'
    },
    'client.getAll': {
        url: 'Cliente/GetByPessoaId?key=&pessoaId=',
        type: 'post'
    },
    'token.create': {
        url: 'ClienteCartao/Insert?key=',
        type: 'post'
    },
    'token.edit': {
        url: 'ClienteCartao/Insert?key=',
        type: 'post'
    },
    'token.getAll': {
        url: 'ClienteCartao/GetByClienteId?key=&clienteId=',
        type: 'post'
    },
    'print.create': {
        url: 'IntencaoImpressao/Insert?key=',
        type: 'post'
    },
    'print.get': {
        url: 'IntencaoImpressao/GetById?key=&intencaoImpressaoId=',
        type: 'get'
    },
    'administrative.create': {
        url: 'PagamentoExterno/InsertPagamentoExternoTipoAdmin?key=',
        type: 'post'
    },
    'login': {
        url: 'Login/Login/',
        type: 'post'
    }
}
