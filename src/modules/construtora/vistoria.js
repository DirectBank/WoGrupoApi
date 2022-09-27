const routes = require('express').Router();
const consultaBanco = require('../funcoes/funDB');
const { TYPES } = require('tedious');
const drive = require('../drive/drive');
var multer = require('multer');
var upload = multer();

function buildConstrutoraQueryParams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 8
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

        respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraQueryParams(query));

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
            'nome': 'id_usuario',
            'tipo': TYPES.Int,
            'valor': body.id_usuario
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
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 11
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
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_usuario: req.bodyToken.id_usuario })
        };

        respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraBody(body));

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

function buildConstrutoraDescricaoPUT(body) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': body.id_empresa
        },
        {
            'nome': 'id_vistoria',
            'tipo': TYPES.Int,
            'valor': body.id_vistoria
        },
        {
            'nome': 'descricao',
            'tipo': TYPES.NVarChar,
            'valor': body.descricao
        },
        {
            'nome': 'coluna',
            'tipo': TYPES.Int,
            'valor': 2
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 13
        }

    ];
}

routes.put('/descricao', async (req, res) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraDescricaoPUT(body));

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

function buildConstrutoraImagem(body) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': body.id_empresa
        },
        {
            'nome': 'id_usuario',
            'tipo': TYPES.Int,
            'valor': body.id_usuario
        },
        {
            'nome': 'id_vistoria',
            'tipo': TYPES.Int,
            'valor': body.id_vistoria
        },
        {
            'nome': 'tamanho',
            'tipo': TYPES.Int,
            'valor': body.imageSize
        },
        {
            'nome': 'extensao',
            'tipo': TYPES.VarChar,
            'valor': body.extensao
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 14
        }

    ];
}

routes.post('/imagem', upload.array("image"), async (req, res) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_usuario: req.bodyToken.id_usuario })
        };

        if (req.files[0] && req.files[0].size > 0 && !body.urlArquivo) {
            body.imagem64 = "1";
            body.extensao = '.' + req.files[0].originalname.split('.').slice(-1);
            body.imageSize = req.files[0].size;
            body.mimeType = req.files[0].mimetype;

            respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraImagem(body));
            const { nomeArquivo, caminho, id_arquivo } = respostaBanco.rows[0];

            await drive.uploadFile(req.files[0], nomeArquivo, caminho, body.id_empresa, body.id_cliente, "wo").then(async file => {
                Object.assign(body, { urlArquivo: file });
            }).catch(err => {
                Object.assign(body, { urlArquivo: '' });
                console.log(err);
            })

            res.status(200).json(respostaBanco)

        }

        else {
            Object.assign(body, { urlArquivo: '' });
            res.status(206);
        }
        if (body.urlArquivo == '') {
            res.status(206).json({ message: "Registro criado, porém sem o anexo." })
        }
        else {
            res.status(200).json({ message: "Registro realizado com sucesso!!" })
        }


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

function buildConstrutoraFinalizar(body) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': body.id_empresa
        },
        {
            'nome': 'id_usuario',
            'tipo': TYPES.Int,
            'valor': body.id_usuario
        },
        {
            'nome': 'id_vistoria',
            'tipo': TYPES.Int,
            'valor': body.id_vistoria
        },
        {
            'nome': 'tamanho',
            'tipo': TYPES.Int,
            'valor': body.imageSize
        },
        {
            'nome': 'extensao',
            'tipo': TYPES.VarChar,
            'valor': body.extensao
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 16
        }

    ];
}

routes.post('/finalizar', upload.array("image"), async (req, res) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_usuario: req.bodyToken.id_usuario })
        };

        if (req.files[0] && req.files[0].size > 0 && !body.urlArquivo) {
            body.imagem64 = "1";
            body.extensao = '.' + req.files[0].originalname.split('.').slice(-1);
            body.imageSize = req.files[0].size;
            body.mimeType = req.files[0].mimetype;

            respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraFinalizar(body));
            const { nomeArquivo, caminho, id_arquivo } = respostaBanco.rows[0];

            await drive.uploadFile(req.files[0], nomeArquivo, caminho, body.id_empresa, body.id_cliente, "wo").then(async file => {
                Object.assign(body, { urlArquivo: file });
            }).catch(err => {
                Object.assign(body, { urlArquivo: '' });
                console.log(err);
            })

            res.status(200).json(respostaBanco)

        }

        else {
            Object.assign(body, { urlArquivo: '' });
            res.status(206);
        }
        if (body.urlArquivo == '') {
            res.status(206).json({ message: "Registro criado, porém sem o anexo." })
        }
        else {
            res.status(200).json({ message: "Registro realizado com sucesso!!" })
        }


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


function buildConstrutoraDeleteImagem(body) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': body.id_empresa
        },
        {
            'nome': 'id_usuario',
            'tipo': TYPES.Int,
            'valor': body.id_usuario
        },
        {
            'nome': 'id_vistoria',
            'tipo': TYPES.Int,
            'valor': body.id_vistoria
        },
        {
            'nome': 'nomeArquivo',
            'tipo': TYPES.VarChar,
            'valor': body.url_firebase
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 15
        }

    ];
}

routes.delete('/imagem', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa, id_usuario: req.bodyToken.id_usuario })
        };

        await drive.deleteFile(query.url_firebase)
            .then(async response => {
                respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraDeleteImagem(query));
                res.status(200).json(respostaBanco.rows);
            }).catch(err => {
                console.log(err)
                res.status(400).json({ message: "Erro ao tentar atualizar o arquivo, tente novamente!" });
            })

    }
    catch (resposeError) {
        console.log(resposeError);
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        }
        else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

});

function buildConstrutoraStatusPUT(body) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': body.id_empresa
        },
        {
            'nome': 'id_vistoria',
            'tipo': TYPES.Int,
            'valor': body.id_vistoria
        },
        {
            'nome': 'status',
            'tipo': TYPES.Int,
            'valor': body.status
        },
        {
            'nome': 'coluna',
            'tipo': TYPES.Int,
            'valor': 1
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 13
        }

    ];
}

routes.put('/status', async (req, res) => {

    const { body } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(body, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente })
        };

        respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraStatusPUT(body));

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

function buildConstrutoraEmpreendimentosQueryParams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 20
        }

    ];
}

routes.get('/empreendimentos', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa })
        };

        respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraEmpreendimentosQueryParams(query));

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

function buildConstrutoraClientesQueryParams(query) {

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
            'valor': 21
        }

    ];
}

routes.get('/clientes', async (req, res) => {

    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa })
        };

        respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraClientesQueryParams(query));

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

function buildConstrutoraContratosQueryParams(query) {

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
            'nome': 'id_empreendimento',
            'tipo': TYPES.Int,
            'valor': query.id_empreendimento
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 22
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
            Object.assign(query, { id_empresa: req.bodyToken.id_empresa })
        };

        respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraContratosQueryParams(query));

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

function buildConstrutoraVistoriaPorContratoQueryParams(query) {

    return [
        {
            'nome': 'id_contrato',
            'tipo': TYPES.Int,
            'valor': query.id_contrato
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 17
        }

    ];
}

routes.get('/contratos/:id_contrato', async (req, res) => {

    const { params } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(params, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente, id_contrato: params.id_contrato });
        }
        respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraVistoriaPorContratoQueryParams(params));

        res.status(200).json(respostaBanco.rows[0]);

    }
    catch (resposeError) {
        console.log(resposeError);
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        }
        else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

});

function buildConstrutoraVistoriaQueryParams(query) {

    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'id_vistoria',
            'tipo': TYPES.Int,
            'valor': query.id_vistoria
        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 12
        },
        {
            'nome': 'api',
            'tipo': TYPES.Int,
            'valor': 1
        }

    ];
}

routes.get('/:id_vistoria', async (req, res) => {

    const { params } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        let respostaBanco;
        if (req.authType == "JWT") {
            Object.assign(params, { id_empresa: req.bodyToken.id_empresa, id_cliente: req.bodyToken.id_cliente });
        }

        respostaBanco = await consultaBanco('APPSP_vistoria', produto, buildConstrutoraVistoriaQueryParams(params));

        for (let index = 0; index < respostaBanco.rows.length; index++) {
            if (respostaBanco.rows[index].urlArquivoAssinatura) {
                await drive.getLinkUrl(respostaBanco.rows[index].urlArquivoAssinatura).then(async (element) => {
                    respostaBanco.rows[index].urlArquivoAssinatura = await element.url[0];
                })
            }

            respostaBanco.rows[index].listaURL = respostaBanco.rows[index].listaURL.split(";").filter(el => el);
            for (let index2 = 0; index2 < respostaBanco.rows[index].listaURL.length; index2++) {
                await drive.getLinkUrl(respostaBanco.rows[index].listaURL[index2]).then(async (element) => {
                    respostaBanco.rows[index].listaURL[index2] = {
                        url: await element.url[0],
                        url_firebase: respostaBanco.rows[index].listaURL[index2]
                    }
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

module.exports = routes;