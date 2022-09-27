const routes = require('express').Router();
const consultaBanco = require('../../modules/funcoes/funDB');
TYPES = require('tedious').TYPES;

function buildConstrutoraQueryParams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'RegInicio',
            'tipo': TYPES.Int,
            'valor': query.regInicio ? query.regInicio : 0
        },
        {
            'nome': 'RegFim',
            'tipo': TYPES.Int,
            'valor': query.regFim ? query.regFim : 50
        },
        {
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': query.id_contrato
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 0
        }

    ];
}

routes.get('/', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_comunicado', produto, buildConstrutoraQueryParams(query));

        res.status(200).json(respostaBanco.rows)

    } catch (resposeError) {
        console.log(resposeError);
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        }
        else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

});

function buildConstrutoraPUTQueryParams(query) {

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
            'nome': 'id_comunicado',
            'tipo': TYPES.Int,
            'valor': query.id_comunicado
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 3
        }

    ];
}

routes.put('/', async (req, res) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_comunicado', produto, buildConstrutoraPUTQueryParams(body));

        res.status(200).json(respostaBanco.rows)

    } catch (resposeError) {
        console.log(resposeError);
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        }
        else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

});

module.exports = routes