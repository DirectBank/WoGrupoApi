const consultaBanco = require('../funcoes/funDB');

function buildParams(param) {
    return [{
            'nome': 'modo',
            'tipo': TYPES.VarChar,
            'valor': 'VALIDA_HASH'
        },
        {
            'nome': 'apikey',
            'tipo': TYPES.VarChar,
            'valor': param.apiKey
        }
    ];
}

async function apiKeyHandler(req, res, next) {

    let apiKeyHeader = req.headers['x-api-key'];

    // const { body } = req;
    const { query } = req;
    const { baseUrl } = req;
    const produto = baseUrl.split('/')[1];

    try {
        let param = { apiKey: apiKeyHeader };

        let respostaBanco;

        if (produto == 'directbank') {
            respostaBanco = await consultaBanco('DBSP_validaUsuario', produto, buildParams(param));
        } else if (produto == 'unidadez') {
            respostaBanco = await consultaBanco('DBSP_validaUsuario', produto, buildParams(param));
        } else if (produto == 'wo' || produto == 'construtora') {
            respostaBanco = await consultaBanco('DBSP_validaUsuario', produto, buildParams(param));
        } else if (produto == 'omp') {
            //Deixado fixo o produto, pois a validação devera ser feita no banco de dados Azure,mesmo sendo produto OMP
            respostaBanco = await consultaBanco('DBSP_validaUsuario', 'unidadez', buildParams(param));
        } else {
            throw ({ statusCode: 400, type: "UrlRequestError", message: `Produto inválido.${process.env.NODE_ENV == 'development' ? 'Verifique a rota de chamada a API' : ''}` });
        }

        if (respostaBanco.rows[0].id_empresa > 0) {
            req.id_empresa = respostaBanco.rows[0].id_empresa;
            next();
        } else {

            res.status(403).send({
                "statusCode": 403,
                message: "API Key inválida!"
            });
        }
    } catch (resposeError) {
        console.log(resposeError);
        if (resposeError.statusCode == undefined) {
            res.status(500).json(resposeError);
        } else {
            res.status(resposeError.statusCode).json({ message: resposeError.message });
        }
    }

}

module.exports = { apiKeyHandler }