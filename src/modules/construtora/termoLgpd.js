const routes = require('express').Router();
const consultaBanco = require('../funcoes/funDB');
const funUtil = require('../funcoes/funUtil');
const TYPES = require('tedious').TYPES;

function buildBodyParams(body) {

    return [
        {
            'nome': 'id_lgpd',
            'tipo': TYPES.Int,
            'valor': body.id_lgpd
        },
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': body.id_empresa
        },
        {
            'nome': 'id_cliente',
            'tipo': TYPES.Int,
            'valor': body.id_cliente
        },
        {
            'nome': 'modo',
            'tipo': TYPES.TinyInt,
            'valor': 1
        }
    ];
}

routes.post('/', async (req, res) => {
    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    
    let respostaBanco;
    if (req.authType == "JWT") {
        Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
    };
    
    try {
        respostaBanco = await consultaBanco('APPSP_aceiteLGPD', 'wo', buildBodyParams(body));
        res.status(200).json({ mensagem: "OK" })
    } catch (resposeError) {
        console.log(resposeError);
        res.status(500).json(resposeError);
    }
});

function buildQueryarams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'id_cliente',
            'tipo': TYPES.Int,
            'valor': query.id_cliente
        },
        
        {
            'nome': 'modo',
            'tipo': TYPES.TinyInt,
            'valor': 0
        }
    ];
}

routes.get('/', async (req, res) => {
    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];
    
    let respostaBanco;
    if (req.authType == "JWT") {
        Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
    };
    
    try {
        respostaBanco = await consultaBanco('APPSP_aceiteLGPD', 'wo', buildQueryarams(body));
        res.status(200).json(respostaBanco.rows[0])
    } catch (resposeError) {
        console.log(resposeError);
        res.status(500).json(resposeError);
    }

});

module.exports = routes