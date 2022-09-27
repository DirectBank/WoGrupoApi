const routes = require('express').Router();
const consultaBanco = require('../../funcoes/funDB');
const funUtil = require('../../funcoes/funUtil');
TYPES = require('tedious').TYPES;

function buildConstrutoraQueryParams(query) {

    return [
        // {
        //     'nome': 'id_empresa',
        //     'tipo': TYPES.VarChar,
        //     'valor': query.id_empresa

        // },
        {
            'nome': 'codigoEmpresa',
            'tipo': TYPES.VarChar,
            'valor': query.codigo
        }, {
            'nome': 'dev',
            'tipo': TYPES.Int,
            'required': false,
            'valor': (query.dev ? query.dev : 0)

        }, {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 20
        }
    ]
}

routes.get('/lista-enviar', async(req, res) => {
    // const { body } = req;
    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        // if (!funUtil.validaId(query.id_empresa)) {
        //     throw { statusCode: 400, message: "Parâmetro inválidos" };
        // }


        if (produto == 'construtora') {
            respostaBanco = await consultaBanco('APPSP_comunicado', produto, buildConstrutoraQueryParams(query));
        } else {
            throw ({ statusCode: 400, type: "UrlRequestError", message: `Produto inválido.${process.env.NODE_ENV == 'development' ? 'Verifique a rota de chamada a API' : ''}` });
        }

        res.status(200).json(respostaBanco.rows)

    } catch (resposeError) {
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        } else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

});

function buildConstrutoraRegistraRetornoParams(param) {

    return [
        {
            'nome': 'enviado',
            'tipo': TYPES.Int,
            'valor': param.enviado
        },
        {
            'nome': 'id_comunicado',
            'tipo': TYPES.Int,
            'valor': param.id_comunicado
        },
        {
            'nome': 'dev',
            'tipo': TYPES.Int,
            'required': false,
            'valor': (param.dev ? param.dev : 0)

        },
        // {
        //     'nome': 'msgErro',
        //     'tipo': TYPES.VarChar,
        //     'required': false,
        //     'valor': body.msgErro
        // },
        {
            'nome': 'modo',
            'tipo': TYPES.Int,
            'valor': 22
        }
    ];
}

routes.post('/registra-retorno', async(req, res) => {

    debugger

    const { body } = req;
    // const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {

        if (produto == 'construtora') {
            respostaBanco = await consultaBanco('APPSP_comunicado', produto, buildConstrutoraRegistraRetornoParams(body));
        } else {
            throw ({ statusCode: 400, type: "UrlRequestError", message: `Produto inválido.${process.env.NODE_ENV == 'development' ? 'Verifique a rota de chamada a API' : ''}` });
        }

        res.status(200).json(respostaBanco.rows)

    } catch (responseError) {
        console.log(responseError);
        if (responseError.statusCode == undefined) {
            res.status(500).json(responseError);
        } else {
            res.status(responseError.statusCode).json({ message: responseError.message });
        }
    }

});

module.exports = routes