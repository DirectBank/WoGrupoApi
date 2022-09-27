const routes = require('express').Router();
const consultaBanco = require('../../modules/funcoes/funDB');
TYPES = require('tedious').TYPES;
const drive = require('../../modules/drive/drive');

function buildEvolucaoConstrutoraQueryParams(query) {

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
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 0
        }

    ];
}

routes.get('/evolucao', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_evolucaoEtapa', produto, buildEvolucaoConstrutoraQueryParams(query));

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

function buildConstrutoraGaleriaQueryParams(query) {

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
        // {
        //     'nome': 'RegInicio',
        //     'tipo': TYPES.Int,
        //     'valor': query.regInicio ? query.regInicio : 0
        // },
        // {
        //     'nome': 'RegFim',
        //     'tipo': TYPES.Int,
        //     'valor': query.regFim ? query.regFim : 50
        // },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 40
        }

    ];
}

routes.get('/imagens', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('WOSP_firebase', produto, buildConstrutoraGaleriaQueryParams(query));

        // for (let index = 0; index < respostaBanco.rows.length; index++) {
        //     await drive.getLinkUrl(respostaBanco.rows[index].urlArquivo)
        //         .then(async (element) => {
        //             respostaBanco.rows[index].urlArquivo = await element.url[0]
        //         })
        // }

        for await (const file of respostaBanco.rows) {
            const fbUrl = await drive.getLinkUrl(file.urlArquivo);
            file.urlArquivo = fbUrl.url[0];
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