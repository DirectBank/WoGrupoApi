const routes = require('express').Router();
const { TYPES } = require('tedious');
const consultaBanco = require('../funcoes/funDB');

function buildAuthParamsFaleConosco(body) {

    return [
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
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': body.id_contrato
        },
        {
            'nome': 'id_empreendimento',
            'tipo': TYPES.Int,
            'valor': body.id_empreendimento
        },
        {
            'nome': 'mensagem',
            'tipo': TYPES.NVarChar,
            'valor': body.mensagem
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 1
        },
    ]
}

routes.post("/", async (req, res, next) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    let respostaBanco;
    if (req.authType == "JWT") {
        Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
    };

    try {
        respostaBanco = await consultaBanco('APPSP_faleConosco', 'wo', buildAuthParamsFaleConosco(body));
        res.status(200).json({ mensagem: "OK" })
    } catch (resposeError) {
        console.log(resposeError);
        res.status(500).json(resposeError);
    }

});

module.exports = routes