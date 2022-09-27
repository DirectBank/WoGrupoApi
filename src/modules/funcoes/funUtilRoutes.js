const toXML = require('jstoxml');
const routes = require('express').Router();
const consultaBanco = require('./funDB');
const funUtil = require('./funUtil');
const funMail = require('./funMail');
TYPES = require('tedious').TYPES;

routes.get('/logoEmpresa/', async(req, res) => {

    try {

        let respostaBanco = await consultaBanco('WOSP_API', [{
                'nome': 'codigo',
                'tipo': TYPES.Int,
                'valor': req.query.codigo
            },
            {
                'nome': 'modo',
                'tipo': TYPES.Int,
                'valor': 1
            }
        ]);

        let base64img;

        if (respostaBanco.rows[0].logotipo != undefined) {

            base64img = Buffer.from(respostaBanco.rows[0].logotipo).toString('base64');
            setTimeout(() => {
                res.status(200).json({ logoMarca: base64img })
            }, 2000);


        } else {

            res.status(200).json({ logoMarca: "" })

        }



    } catch (resposeError) {
        // console.log("Resposta do Erro",resposeError)
        if (resposeError.statusCode != undefined) {
            res.status(resposeError.statusCode).json({ messageError: resposeError.message });
        } else {
            res.status(500).json({ messageError: resposeError.message });
        }
    }
    // res.json({texto:"Seu id é "+id_empresa}) ;

});

routes.get('/imgPerfil/', async(req, res) => {

    try {


        let respostaBanco = await consultaBanco('WOSP_API', [{
                'nome': 'id_usuario',
                'tipo': TYPES.Int,
                'valor': req.query.id_usuario
            },
            {
                'nome': 'modo',
                'tipo': TYPES.Int,
                'valor': 2
            }
        ]);

        let base64img;

        if (respostaBanco.rows[0].imgFoto != undefined) {

            base64img = Buffer.from(respostaBanco.rows[0].imgFoto).toString('base64');
            setTimeout(() => {
                res.status(200).json({ imgFoto: base64img })
            }, 2000);


        } else {

            res.status(200).json({ imgFoto: "" })

        }



    } catch (resposeError) {
        // console.log("Resposta do Erro",resposeError)
        if (resposeError.statusCode != undefined) {
            res.status(resposeError.statusCode).json({ messageError: resposeError.message });
        } else {
            res.status(500).json({ messageError: resposeError.message });
        }
    }
    // res.json({texto:"Seu id é "+id_empresa}) ;

});

routes.get('/teste/', async(req, res) => {

    const { query } = req;

    funMail.enviarEmailSendGrid().then((data) => {
            res.status(200).json(data);
        })
        .catch(error => {
            if (error.statusCode == undefined) {
                res.status(500).json(error);
            } else {
                res.status(error.statusCode).json({ message: error.message });
            }
        });

});

routes.get('/teste-boleto/', async(req, res) => {
    var request = require('request');
        // request('https://192.168.15.10:44356/Boleto/boletoPDF.aspx?processo=1602077716636&id=20759683&novoVcto=10/10/2020&cpf=111.pdf', function (error, response, body) {
    request('http://192.168.15.10:62542/Boleto/boletoPDF.aspx?processo=1602077716636&id=20759683&novoVcto=10/10/2020&cpf=111', function(error, response, body) {
        res.set({
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline;filename="boleto.pdf"`,
            // 'Content-Disposition': `attachment;filename="boleto.pdf"`,
        });
        res.status(200).send(body)
    })

});

routes.post('/teste/json-xml', async(req, res) => {

    const { body } = req;
    
    try {
        let arquivo = { cliente: body }
        let data = toXML(arquivo);
        res.set('Content-Type', 'text/xml');
        res.status(200)(data);
    } catch (error) {
        if (error.statusCode == undefined) {
            res.status(500).json(error);
        } else {
            res.status(error.statusCode).json({ message: error.message });
        }
    }

});

routes.get('/handshake/', async(req, res) => {

    // const { body } = req;
    const { query } = req;

    try {
        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

});

routes.get('/rebuild-reorganize-index', async(req, res) => {
    const { query } = req;

    try {
        let respostaBanco = await consultaBanco('ADMSP_rebuild_reorganize_index', 'unidadez', [{
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': query.modo ? query.modo : 1
        }]);

        res.status(200).json(respostaBanco.rows)

    } catch (resposeError) {
        console.log("Resposta do Erro", resposeError)
        if (resposeError.statusCode != undefined) {
            res.status(resposeError.statusCode).json({ messageError: resposeError.message });
        } else {
            res.status(500).json({ messageError: resposeError.message });
        }
    }

});

module.exports = routes;