const routes = require('express').Router();
const consultaBanco = require('../funcoes/funDB');
TYPES = require('tedious').TYPES;
const multer = require('multer');
const d4signService = require('../funcoes/d4sign-service')


const middlewareParaArmazenarArquivo = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB
    },
});

function buildBuscaKeyParams(query) {
    // Comentado o corpo ,pois se um dia precisa para essa procedure é só descomentar
    return [
        {
            'nome': 'id_empresa',
            'tipo': TYPES.Int,
            'valor': query.id_empresa
        },
        {
            'nome': 'desenv',
            'tipo': TYPES.Int,
            'required': false,
            'valor': (query.desenv ? query.desenv : 0)

        },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 5
        }
    ]
}

// Middleware para buscar o token
routes.use('/', async (req, res, next) => {

    let { query } = req
    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (query.id_empresa && produto === "wo") {
        try {
            respostaBanco = await consultaBanco('WOSP_assinaturaEletronica', produto, buildBuscaKeyParams(query));
            if (respostaBanco.rows.length > 0 && respostaBanco.rows[0].tokenApi && respostaBanco.rows[0].cryptKey && respostaBanco.rows[0].cofreD4sign) {
                let tokenParams = {
                    tokenAPI: respostaBanco.rows[0].tokenApi,
                    cryptKey: respostaBanco.rows[0].cryptKey
                }

                req.tokenParams = tokenParams;
                req.uuid_cofre = respostaBanco.rows[0].cofreD4sign
                next();
            }
            else {
                res.status(404).json({
                    message: "Credenciais não encontradas."
                });
            }

        } catch (error) {
            console.dir(error)
            res.status(500).json(error);
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});




routes.get('/lista-cofre', async (req, res) => {

    let { tokenParams } = req

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {
            let cofres = await d4signService.listaCofresEmpresa(tokenParams);
            res.status(200).send(cofres)
        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});


routes.get('/documentos', async (req, res) => {

    let { tokenParams, uuid_cofre } = req

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {
            let cofres = await d4signService.listaDocumentosCofre(uuid_cofre, tokenParams);
            res.status(200).send(cofres)
        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});

routes.get('/documentos/download', async (req, res) => {

    let { tokenParams, uuid_cofre } = req
    let { uuid_documento } = req.query
    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {
            let cofres = await d4signService.downloadDocumento(uuid_documento, tokenParams);
            res.status(200).send(cofres)
        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});


routes.post('/documentos/upload', middlewareParaArmazenarArquivo.single('file'), async (req, res) => {
    let { file } = req;
    let { tokenParams, uuid_cofre } = req

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {
            // console.log(file);
            if (!file) {
                res.status(400).json({ message: 'Arquivo inválido!' })
            } else {
                let cofres = await d4signService.uploadDocumentoCofre(file, uuid_cofre, tokenParams);
                res.status(200).send(cofres)
                // console.log(file);
                // res.status(200).send();
            }
        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});

routes.post('/documentos/cancela', async (req, res) => {
    let { uuid_documento, comentario } = req.body;
    let { tokenParams } = req

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {
            // console.log(file);
            let cofres = await d4signService.cancelarDocumentoCofre(uuid_documento, comentario, tokenParams);
            res.status(200).send(cofres)
            // console.log(file);
            // res.status(200).send();

        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});

routes.post('/documentos/envia-assinatura', async (req, res) => {
    let { uuid_documento, comentario } = req.body;
    let { tokenParams } = req

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {
            // console.log(file);
            let cofres = await d4signService.enviaDocumentoParaAssinatura(uuid_documento, comentario, tokenParams);
            res.status(200).send(cofres)
            // console.log(file);
            // res.status(200).send();

        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});

routes.post('/documentos/reenvia-assinatura', async (req, res) => {
    let { email, chaveAssinatura, uuid_documento } = req.body;
    let { tokenParams } = req

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {
            // console.log(file);
            let cofres = await d4signService.reenviaDocumentoParaAssinatura(uuid_documento, email, chaveAssinatura, tokenParams);
            res.status(200).send(cofres)
            // console.log(file);
            // res.status(200).send();

        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});


routes.get('/:uuid_documento/signatarios', async (req, res) => {

    let { tokenParams, uuid_cofre } = req
    let { uuid_documento } = req.params

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {

            console.log(uuid_documento)
            let cofres = await d4signService.listaSignatariosDocumento(uuid_documento, tokenParams);
            res.status(200).send(cofres)
        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});

routes.post('/:uuid_documento/signatarios/adiciona', async (req, res) => {
    let { body } = req;
    let { uuid_documento } = req.params
    let { tokenParams } = req

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {
            /*
               let modeloBody = {
                   "email": "email@user.com.br", //E-mail do signatário (pessoa que precisa assinar o documento)
                   "act": "1", //Ação da assinatura. ver rota ações signatario
                   "foreign": "0", //Indica se o signatário é estrangeiro, ou seja, se possui CPF. 0=Possui CPF (Brasileiro)/1=Não possui CPF (Estrangeiro)
                   "certificadoicpbr": "0", //Indica se o signatário DEVE efetuar a assinatura com um Certificado Digital ICP-Brasil. 0 = Será efetuada a assinatura padrão da D4Sign./1=Será efetuada a assinatura com um Certificado Digital ICP-Brasil.
                   "skipemail":0, //Defina com o valor 1 para não enviar e-mails ao signatário
                   "assinatura_presencial": "0", //Indica se o signatário DEVE efetuar a assinatura de forma presencial. 
                   "assinatura_presencial_link": "LINK PARA ASSINATURA PRESENCIAL"
               }
           */
            let result = await d4signService.cadastrarSignatarioDocumento(body, uuid_documento, tokenParams);
            res.status(200).send(result)
            // console.log(file);
            // res.status(200).send();

        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});

routes.post('/:uuid_documento/signatarios/remove', async (req, res) => {
    let { body } = req;
    let { uuid_documento } = req.params
    let { tokenParams } = req

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {

            /*
               let modeloBody = {
                    "email-signer": "email@dominio.com",
                    "key-signer": "NyWx=" //Gerada após o cadastro
                }
           */

            let result = await d4signService.deletarSignatarioDocumento(body, uuid_documento, tokenParams);
            res.status(200).send(result)
            // console.log(file);
            // res.status(200).send();

        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});

routes.get('/signatarios/acoes', async (req, res) => {

    // let { tokenParams, uuid_cofre } = req

    const { baseUrl } = req;

    const produto = baseUrl.split('/')[1];

    if (produto === "wo") {
        try {
            let cofres = await d4signService.listaAcoesSignatarios();
            res.status(200).send(cofres)
        } catch (error) {
            if (error.statusCode) {
                res.status(error.statusCode).json(error);
            } else {
                res.status(500).json(error);
            }
        }
    } else {
        res.status(404).json({
            message: "Permitido somente para produto WO."
        });
    }

});

module.exports = routes
