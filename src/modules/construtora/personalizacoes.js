const routes = require('express').Router();
const consultaBanco = require('../funcoes/funDB');
const xml2js = require("xml2js");
const { TYPES } = require('tedious');
var parseString = new xml2js.Parser({ explicitArray: false }).parseString;
const drive = require('../drive/drive');

function buildConstrutoraQueryParams(query) {

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
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': query.id_contrato
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 3
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

        respostaBanco = await consultaBanco('APPSP_enquete', produto, buildConstrutoraQueryParams(query));

        res.status(200).json(respostaBanco.rows);

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

function buildConstrutoraAlternativasQueryParams(query) {

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
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': query.id_contrato
        },
        {
            'nome': 'id_enquete',
            'tipo': TYPES.Int,
            'valor': query.id_personalizacao
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 4
        }

    ];
}

routes.get('/alternativas', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_enquete', produto, buildConstrutoraAlternativasQueryParams(query));

        for (let index = 0; index < respostaBanco.rows.length; index++) {
            respostaBanco.rows[index].listaURL = respostaBanco.rows[index].listaURL.split(";").filter(el => el);
            for (let index2 = 0; index2 < respostaBanco.rows[index].listaURL.length; index2++) {
                await drive.getLinkUrl(respostaBanco.rows[index].listaURL[index2]).then(async (element) => {
                    respostaBanco.rows[index].listaURL[index2] = await element.url[0]
                })
            }

        }

        res.status(200).json(respostaBanco.rows);

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

function buildConstrutoraBody(body) {

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
            'nome': 'id_empreendimento',
            'tipo': TYPES.Int,
            'valor': body.id_empreendimento
        },
        {
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': body.id_contrato
        },
        {
            'nome': 'id_enquete',
            'tipo': TYPES.Int,
            'valor': body.id_enquete
        },
        {
            'nome': 'id_alternativaSelecionada',
            'tipo': TYPES.Int,
            'valor': body.id_alternativaSelecionada
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 31
        }

    ];
}

routes.post('/', async (req, res) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        // console.log(buildConstrutoraBody(body))

        respostaBanco = await consultaBanco('APPSP_enquete', produto, buildConstrutoraBody(body));

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

function buildConstrutoraBodyPUT(body) {

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
            'nome': 'id_empreendimento',
            'tipo': TYPES.Int,
            'valor': body.id_empreendimento
        },
        {
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': body.id_contrato
        },
        {
            'nome': 'id_enquete',
            'tipo': TYPES.Int,
            'valor': body.id_enquete
        },
        {
            'nome': 'id_alternativaSelecionada',
            'tipo': TYPES.Int,
            'valor': body.id_alternativaSelecionada
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 32
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

        respostaBanco = await consultaBanco('APPSP_enquete', produto, buildConstrutoraBodyPUT(body));

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

function buildConstrutoraBodyFinalizar(body) {

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
            'nome': 'id_empreendimento',
            'tipo': TYPES.Int,
            'valor': body.id_empreendimento
        },
        {
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': body.id_contrato
        },
        {
            'nome': 'id_grupoEnquete',
            'tipo': TYPES.Int,
            'valor': body.id_grupoEnquete
        },
        {
            'nome': 'parcelas',
            'tipo': TYPES.Int,
            'valor': body.parcela
        },
        {
            'nome': 'diaVcto',
            'tipo': TYPES.Int,
            'valor': body.diaVcto
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 40
        }

    ];
}

routes.post('/finalizar', async (req, res) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_enquete', produto, buildConstrutoraBodyFinalizar(body));

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