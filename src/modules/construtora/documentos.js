const routes = require('express').Router();
const consultaBanco = require('../funcoes/funDB');
TYPES = require('tedious').TYPES;
const drive = require('../drive/drive');

function buildConstrutoraDocumentosQueryParams(query) {

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
            'valor': 44
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

        respostaBanco = await consultaBanco('WOSP_firebase', produto, buildConstrutoraDocumentosQueryParams(query));
        for (let index = 0; index < respostaBanco.rows.length; index++) {
            await drive.getLinkUrl(respostaBanco.rows[index].urlArquivo).then(async (element) => { 
                respostaBanco.rows[index].urlArquivo = await element.url[0]
            })
        }
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

function buildConstrutoraContratosQueryParams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': query.id_contrato
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 41
        }

    ];
}

routes.get('/contratos', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];
    
    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('WOSP_firebase', produto, buildConstrutoraContratosQueryParams(query));
        for (let index = 0; index < respostaBanco.rows.length; index++) {
            await drive.getLinkUrl(respostaBanco.rows[index].urlArquivo).then(async (element) => { 
                respostaBanco.rows[index].urlArquivo = await element.url[0]
            })
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

function buildConstrutoraTermosVistoriaQueryParams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': query.id_contrato
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 42
        }

    ];
}

routes.get('/termos-vistoria', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('WOSP_firebase', produto, buildConstrutoraTermosVistoriaQueryParams(query));
        for (let index = 0; index < respostaBanco.rows.length; index++) {
            await drive.getLinkUrl(respostaBanco.rows[index].urlArquivo).then(async (element) => {
                respostaBanco.rows[index].urlArquivo = await element.url[0]
            })
        }

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

function buildConstrutoraPlantasQueryParams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'id_empreendimento',
            'tipo': TYPES.Int,
            'valor': query.id_empreendimento
        },
        {
            'nome': 'tipoPlanta',
            'tipo': TYPES.Int,
            'valor': query.tipoPlanta
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 43
        }

    ];
}

routes.get('/plantas', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('WOSP_firebase', produto, buildConstrutoraPlantasQueryParams(query));
        for (let index = 0; index < respostaBanco.rows.length; index++) {
            await drive.getLinkUrl(respostaBanco.rows[index].urlArquivo).then(async (element) => {
                respostaBanco.rows[index].urlArquivo = await element.url[0]
            })
        }

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